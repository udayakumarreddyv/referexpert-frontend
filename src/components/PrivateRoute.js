import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CookieHelper from '../utils/cookieHelper';

// Apis
import { checkIfAccessTokenExpired, refreshAccessToken } from '../api/tokensApi';

const logoutUser = async () => {
    CookieHelper.deleteCookie('accessCookie');
    CookieHelper.deleteCookie('refreshCookie');
};

function PrivateRoute({ component: Component, classes, ...rest }) {
    const { loggedIn } = useSelector(state => state.user);

    // Check if access token is expired
    // If so delete the cookies and update state to logout user
    useEffect(() => {
        const checkAccessToken = async () => {
            const accessTokenExpired = await checkIfAccessTokenExpired();
            if (accessTokenExpired) {
                
                // Check if we can find the refresh token, if not logout user
                const refreshCookie = CookieHelper.getCookie('refreshCookie');
                if (!refreshCookie) {
                    await logoutUser();
                    return;
                };

                // Attempt to refresh the access token using the refresh token
                const { refreshed, results } = await refreshAccessToken(refreshCookie.token);
                if (!refreshed) await logoutUser();

                // Update cookies with new tokens & update state
                const { accessToken, refreshToken, tokenType } = results;
                const newAccessCookie = { token: accessToken };
                CookieHelper.saveCookie('accessCookie', newAccessCookie);
            };
        };
        checkAccessToken();
    }, []);

    // Redirect if user not logged in
    if (!loggedIn) {
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