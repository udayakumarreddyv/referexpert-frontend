import { apiService } from './apiService';
import { handleTokenRefresh, isTokenExpired, getAuthHeader } from '../utils/authUtils';

// Base URL for all API requests
const BASE_URL = process.env.REACT_APP_API_URL || '';

// Helper to construct full URL
const getFullUrl = (endpoint) => `${BASE_URL}${endpoint}`;

export const apiClient = {
  async request(method, endpoint, { token, data, ...options } = {}) {
    let currentToken = token;

    // Check if token needs refresh
    if (token && isTokenExpired(token)) {
      try {
        const refreshResult = await handleTokenRefresh();
        currentToken = refreshResult.accessToken;
      } catch (error) {
        // Token refresh failed, proceed with request (it will fail with 401 if needed)
        console.error('Token refresh failed:', error);
      }
    }

    const headers = currentToken ? getAuthHeader(currentToken) : {};
    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    return apiService[method](getFullUrl(endpoint), config);
  },

  async get(endpoint, options = {}) {
    return this.request('get', endpoint, options);
  },

  async post(endpoint, data, options = {}) {
    return this.request('post', endpoint, { ...options, data });
  },

  async put(endpoint, data, options = {}) {
    return this.request('put', endpoint, { ...options, data });
  },

  async delete(endpoint, options = {}) {
    return this.request('delete', endpoint, options);
  }
};
