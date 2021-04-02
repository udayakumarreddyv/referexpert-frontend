import React, { createContext, useEffect, useReducer } from 'react';
import Reducer from './Reducer';
import CookieHelper from '../utils/cookieHelper';

// Initial global state
const initialState = {
    loggedIn: false,
    userEmail: null,
    userType: null,
    userDetails: {}
};
const tokenCookieName = 'accessCookie';

// Get user info
const getUserInfo = async (email, token) => {
    try {
        const url = `/referexpert/users/${email}`;
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

// Holds global state for components to access
const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    useEffect(async () => {
        
        // Check if access token cookie exists
        const tokenCookie = CookieHelper.getCookie(tokenCookieName);
        if (tokenCookie) {

            // Get user details
            const userDetails = await getUserInfo(tokenCookie.email, 'tokenCookie.token');
            
            // Expired or invalid token, remove cookie
            if (userDetails === 'Invalid token') {
                CookieHelper.deleteCookie(tokenCookieName);
                return;
            };

            // Update state to login user
            const payload = {
                token: tokenCookie.token,
                userEmail: userDetails.email,
                userType: userDetails.userType,
                userDetails,
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