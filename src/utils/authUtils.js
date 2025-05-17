import { apiClient } from '../api/client';
import { store } from '../store/store';
import { updateAccessToken } from '../store/slices/userSlice';
import CookieHelper from './cookieHelper';

let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error = null) => {
  failedRequestsQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedRequestsQueue = [];
};

export const handleTokenRefresh = async () => {
  try {
    if (isRefreshing) {
      // If already refreshing, wait for it to complete
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      });
    }

    isRefreshing = true;
    const refreshCookie = CookieHelper.getCookie('refreshCookie');

    if (!refreshCookie?.token) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/referexpert/refreshtoken', 
      { refreshToken: refreshCookie.token },
      { headers: { isRefreshToken: true } }
    );

    // Update cookies and store with new tokens
    const { accessToken, refreshToken } = response;
    CookieHelper.saveCookie('accessCookie', { token: accessToken });
    CookieHelper.saveCookie('refreshCookie', { token: refreshToken });
    store.dispatch(updateAccessToken({ token: accessToken }));

    processQueue();
    return response;
  } catch (error) {
    processQueue(error);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const getAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`
});
