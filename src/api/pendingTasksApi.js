// Get the pending tasks that the user needs to attend to
// This is called on login
const fetchPendingTasks = async (token) => {
    try {
        const url = 'referexpert/pendingtasks';
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    };
};

// Get the NEW pending tasks that the user needs to attend to
// This is used when we want to update the pendingTasks on the fly
const refreshPendingTasks = async ({ token, dispatch }) => {
    try {
        const url = 'referexpert/pendingtasks';
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        const results = await response.json();

        // Update state to refresh pending tasks
        dispatch({ type: 'UPDATE_PENDING_TASKS', payload: results });
    } catch (err) {
        console.log(err);
    };
};

export {
    fetchPendingTasks,
    refreshPendingTasks
}