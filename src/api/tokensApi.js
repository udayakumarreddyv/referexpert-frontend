import CookieHelper from '../utils/cookieHelper';

const checkIfAccessTokenExpired = async () => {
    try {
        // Get access cookie
        // Return false if we couldn't find the cookie
        const accessCookie = CookieHelper.getCookie('accessCookie');
        if (!accessCookie) return true;

        // Send api request to notifications to see if the access token is still valid
        // The api route does not matter as we are simply looking for the status of the response
        const accessToken = accessCookie.token;
        const notificationsUrl = 'referexpert/notification';
        const accessTokenResponse = await fetch(notificationsUrl, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        const accessTokenStatus = accessTokenResponse.status;

        // Access token did not work and no refresh token, logout user
        if (accessTokenStatus !== 200) return true;

        // Return false to tell private route that accessToken is not expired
        return false;
    } catch (err) {
        throw err;
    };
};

// Get refresh token
const refreshAccessToken = async (refreshToken) => {
    try {
        const url = '/referexpert/refreshtoken';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'isRefreshToken': true,
            },
            body: JSON.stringify({ refreshToken }),
        });

        // Catch failure of refreshing token
        if (response.status !== 200) return { refreshed: false, results: null };

        // Make sure body has keys we need
        const results = await response.json();
        const requiredKeys = ['accessToken', 'refreshToken', 'tokenType'];
        if (!requiredKeys.every((neededKey) => Object.keys(results).includes(neededKey))) {
            throw 'Missing a required key(s) in body of refresh response';
        };

        return { refreshed: true, results };
    } catch (err) {
        throw err;
    };
};

export { checkIfAccessTokenExpired, refreshAccessToken };
