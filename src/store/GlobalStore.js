import React, { createContext, useEffect, useReducer } from 'react';
import Reducer from './Reducer';
import CookieHelper from '../utils/cookieHelper';

// Apis
import { fetchPendingTasks } from '../api/pendingTasksApi';

// Initial global state
const initialState = {
    loggedIn: false,
    token: null,
    userEmail: null,
    userType: null,
    userDetails: {},
    pendingTasks: {}
};

// Get user info
const getUserInfo = async (token) => {
    try {
        const url = `/referexpert/userdetails`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        // Failed to get user details
        if (response.status !== 200) {
            return 'Invalid token';
        };

        return await response.json();
    } catch (err) {
        throw err;
    };
};

// Get refresh token
const refreshAccessToken = async (refreshToken) => {
    try {

        // REQUEST HAS TO BE POST SINCE GET CANNOT HAVE BODY
        // LET REDDY KNOW
        const url = '/referexpert/refreshtoken';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'isRefreshToken': true,
            },
            body: JSON.stringify({ refreshToken }),
        });

        // Catch internal server errors
        if (response.status > 499) throw response;
        
        // Check if expired
        if (response.status === 401) return 'refresh token expired';

        // Make sure body has keys we need
        const results = await response.json();
        const requiredKeys = ['accessToken', 'refreshToken', 'tokenType'];
        if (!requiredKeys.every((neededKey) => Object.keys(results).includes(neededKey))) {
            throw 'Missing a required key(s) in body of refresh response';
        };

        return results;
    } catch (err) {
        throw err;
    };
};

// Holds global state for components to access
const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    useEffect(async () => {
        
        // Get cookies
        const accessCookie = CookieHelper.getCookie('accessCookie');
        const refreshCookie = CookieHelper.getCookie('refreshCookie');
        let newAccessCookie = null;

        // Try to login user if we found either cookies
        if (accessCookie || refreshCookie) {

            // Get user details
            let userDetails;
            let pendingTasks;
            let needToRefresh = false;
            if (accessCookie && 'token' in accessCookie) {
                userDetails = await getUserInfo(accessCookie.token);
                pendingTasks = await fetchPendingTasks(accessCookie.token);

                // Expired or invalid token, remove cookie
                if (userDetails === 'Invalid token') {
                    needToRefresh = true;
                    CookieHelper.deleteCookie('accessCookie');
                };
            } else {
                needToRefresh = true;
            };

            // Need to refresh accessToken & we have the refreshCookie
            if (needToRefresh && refreshCookie && 'token' in refreshCookie) {
                console.log('Need to refresh token!')
                const results = await refreshAccessToken(refreshCookie.token);
                const newAccessToken = results.accessToken;

                // Refresh request failed, send to login screen
                if (results === 'refresh token expired') return;

                // Try to get user details again
                userDetails = await getUserInfo(newAccessToken);
                pendingTasks = await fetchPendingTasks(newAccessToken);

                // Expired or invalid token, remove cookie
                // Exit trying to login user, send to signin page
                if (userDetails === 'Invalid token') {
                    CookieHelper.deleteCookie('refreshCookie');
                    return;
                };

                // Update the accessCookie
                newAccessCookie = { token: newAccessToken };
                CookieHelper.saveCookie('accessCookie', newAccessCookie);
            };

            // Update state to login user
            const payload = {
                token: newAccessCookie ? newAccessCookie.token : accessCookie.token,
                userEmail: userDetails.email,
                userType: userDetails.userType,
                userDetails,
                pendingTasks
            };
            dispatch({ type: 'LOGIN_USER', payload: payload });
        };
    }, []);
    
    return (
        <Context.Provider value={[state, dispatch]}>
            { children }
        </Context.Provider>
    );
};

export const Context = createContext(initialState);
export default Store;