import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../store/slices/userSlice';
import { getUserInfo } from '../api/userApi';
import { fetchPendingTasks } from '../api/pendingTasksApi';
import CookieHelper from '../utils/cookieHelper';

export const useAuth = () => {
  const dispatch = useDispatch();

  const login = useCallback(async (loginResponse) => {
    const { accessToken, refreshToken } = loginResponse;
    
    // Get user info using new access token
    const userInfo = await getUserInfo({ token: accessToken });
    const pendingTasks = await fetchPendingTasks(accessToken);
    
    // Update cookies
    const accessCookie = { token: accessToken };
    const refreshCookie = { token: refreshToken };
    CookieHelper.saveCookie('accessCookie', accessCookie);
    CookieHelper.saveCookie('refreshCookie', refreshCookie);
    
    // Update global state with user info
    dispatch(loginUser({
      token: accessToken,
      userEmail: userInfo.email,
      userType: userInfo.userType,
      userDetails: userInfo,
      pendingTasks
    }));
  }, [dispatch]);

  const logout = useCallback(() => {
    // Delete cookies
    CookieHelper.deleteCookie('accessCookie');
    CookieHelper.deleteCookie('refreshCookie');
    
    // Update global state
    dispatch(logoutUser());
  }, [dispatch]);

  return {
    login,
    logout
  };
};
