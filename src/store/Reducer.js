const Reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                loggedIn: true,
                userEmail: action.payload.userEmail,
                userType: action.payload.userType,
            };
        default:
            return state;
    };
};

export default Reducer;