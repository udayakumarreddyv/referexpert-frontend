const Reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                loggedIn: true,
                token: action.payload.token,
                userEmail: action.payload.userEmail,
                userType: action.payload.userType,
                userDetails: action.payload.userDetails,
                pendingTasks: action.payload.pendingTasks,
            };
        case 'UPDATE_ACCESS_TOKEN':
            return {
                ...state,
                token: action.payload.token,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                userDetails: action.payload,
            };
        case 'UPDATE_PENDING_TASKS':
            return {
                ...state,
                pendingTasks: action.payload,
            }
        case 'LOGOUT_USER':
            return {
                ...state,
                loggedIn: false,
                userEmail: null,
                userType: null,
                pendingTasks: {}
            };
        default:
            return state;
    };
};

export default Reducer;