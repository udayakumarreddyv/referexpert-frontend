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