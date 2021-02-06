const Reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                loggedIn: true,
                userEmail: action.payload.userEmail,
                userType: action.payload.userType,
            };
        case 'LOGOUT_USER':
            return {
                ...state,
                loggedIn: false,
                userEmail: null,
                userType: null,
            };
        default:
            return state;
    };
};

export default Reducer;