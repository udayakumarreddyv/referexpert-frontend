import { apiClient } from './client';
import { ApiError, AuthenticationError, NetworkError } from './apiService';

export const loginUser = async ({ email, password }) => {
    try {
        return await apiClient.post('/referexpert/signin', { email, password });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw new Error('Invalid email or password');
        }
        if (error instanceof ApiError) {
            throw new Error(error.message || 'Login failed');
        }
        if (error instanceof NetworkError) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        throw error;
    }
};

export const getUserInfo = async ({ token }) => {
    try {
        return await apiClient.get('/referexpert/user', { token });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw new Error('Session expired. Please log in again.');
        }
        if (error instanceof ApiError) {
            throw new Error(error.message || 'Failed to get user information');
        }
        if (error instanceof NetworkError) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        throw error;
    }
};

export const updateUserInfo = async ({ token, userInfo }) => {
    try {
        return await apiClient.put('/referexpert/user', userInfo, { token });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw new Error('Session expired. Please log in again.');
        }
        if (error instanceof ApiError) {
            throw new Error(error.message || 'Failed to update user information');
        }
        if (error instanceof NetworkError) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        throw error;
    }
};

export const resetPassword = async ({ email }) => {
    try {
        return await apiClient.post('/referexpert/resetpassword', { email });
    } catch (error) {
        if (error instanceof ApiError) {
            throw new Error(error.message || 'Failed to reset password');
        }
        if (error instanceof NetworkError) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        throw error;
    }
};

export const confirmAccount = async ({ token }) => {
    try {
        return await apiClient.post('/referexpert/confirm', { token });
    } catch (error) {
        if (error instanceof ApiError) {
            throw new Error(error.message || 'Failed to confirm account');
        }
        if (error instanceof NetworkError) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        return await apiClient.post('/referexpert/signup', userData);
    } catch (error) {
        if (error instanceof ApiError) {
            throw new Error(error.message || 'Registration failed');
        }
        if (error instanceof NetworkError) {
            throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        throw error;
    }
};