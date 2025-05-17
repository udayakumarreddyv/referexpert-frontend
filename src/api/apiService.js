import { store } from '../store/store';
import { logoutUser } from '../store/slices/userSlice';
import CookieHelper from '../utils/cookieHelper';

export class ApiError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      // Clear auth state and redirect to login
      store.dispatch(logoutUser());
      CookieHelper.deleteCookie('accessCookie');
      CookieHelper.deleteCookie('refreshCookie');
      throw new AuthenticationError('Session expired. Please log in again.');
    }

    if (response.status >= 500) {
      throw new ApiError('An unexpected error occurred. Please try again later.', response.status, data);
    }

    throw new ApiError(
      isJson && data.message ? data.message : 'Request failed',
      response.status,
      data
    );
  }

  return data;
};

export const apiService = {
  async get(url, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new NetworkError('Network error occurred. Please check your connection.');
    }
  },

  async post(url, data, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new NetworkError('Network error occurred. Please check your connection.');
    }
  },

  async put(url, data, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new NetworkError('Network error occurred. Please check your connection.');
    }
  },

  async delete(url, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new NetworkError('Network error occurred. Please check your connection.');
    }
  }
};
