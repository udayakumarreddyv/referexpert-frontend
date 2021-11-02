// Fetch notification methods
// This will let us know if we need to popup a modal to the user for them to add them
const fetchNotifications = async ({ token }) => {
    try {
        const url = 'referexpert/notification';
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        
        // Catch errors
        if (response.status !== 200) throw response;

        const results = await response.json();

        // User has not added there notification methods yet
        // We know this by the empty object that is passed
        const isEmptyObject = Object.keys(results).length === 0;
        if (isEmptyObject) {
            console.log('user needs to add notification methods');
            return { results: null, needToOpenModal: true };
        };

        return { results, needToOpenModal: false };
    } catch (err) {
        throw err;
    };
};

export {
    fetchNotifications
}