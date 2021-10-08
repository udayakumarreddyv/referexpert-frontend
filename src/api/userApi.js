exports.loginUser = async ({ email, password }) => {
    try {
        const url = '/referexpert/validateuser';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const results = await response.json();

        // Catch any errors
        if ('error' in results) {

            // Invalid credentials
            if (results.error === 'Unauthorized') {
                return 'Unauthorized';
            } else {
                throw results.error;
            };
        };

        return results;
    } catch (err) {
        throw err;
    };
};

// Get user info
exports.getUserInfo = async ({ token }) => {
    try {
        const url = `/referexpert/userdetails`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        
        // Failed to get user details
        if (response.status !== 200) return 'Invalid token';
        return await response.json();
    } catch (err) {
        throw err;
    };
};