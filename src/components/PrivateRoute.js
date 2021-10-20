import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from '../store/GlobalStore';
import CookieHelper from '../utils/cookieHelper';

// Apis
import { checkIfAccessTokenExpired, refreshAccessToken } from '../api/tokensApi';

const logoutUser = async ({ dispatch }) => {
    CookieHelper.deleteCookie('accessCookie');
    CookieHelper.deleteCookie('refreshCookie');
    await dispatch({ type: 'LOGOUT_USER', payload: null });
};

const PrivateRoute = ({ component: Component, classes, ...rest }) => {
    const [state, dispatch] = useContext(Context);

    // Check if access token is expired
    // If so delete the cookies and update state to logout user
    useEffect(async () => {
        const accessTokenExpired = await checkIfAccessTokenExpired();
        if (accessTokenExpired) {
            
            // Check if we can find the refresh token, if not logout user
            const refreshCookie = CookieHelper.getCookie('refreshCookie');
            if (!refreshCookie) {
                await logoutUser({ dispatch });
                return;
            };

            // Attempt to refresh the access token using the refresh token
            const { refreshed, results } = await refreshAccessToken(refreshCookie.token);
            if (!refreshed) await logoutUser({ dispatch });

            // Update cookies with new tokens & update state
            const { accessToken, refreshToken, tokenType } = results;
            const newAccessCookie = { token: accessToken };
            CookieHelper.saveCookie('accessCookie', newAccessCookie);
            await dispatch({ type: 'UPDATE_ACCESS_TOKEN', payload: newAccessCookie })
        };
    });

    // Redirect if user not logged in
    if (!state.loggedIn) {
        return <Redirect to='/signin' />;
    };

    // Continue to route
    return (
        <Route
            {...rest}
            render={(props) => <Component classes={classes} {...props} />}
        />
    );
};

export default PrivateRoute;