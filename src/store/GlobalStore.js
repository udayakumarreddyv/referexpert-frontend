import React, { createContext, useEffect, useReducer } from 'react';
import Reducer from './Reducer';
// import cookies from 'js-cookies';

// Initial global state
const initialState = {
    loggedIn: false,
    userEmail: null,
    userType: null,
};

// Checks if user is logged in using a access cookies
// const checkUserLogggedIn = async (dispatch) => {
//     const hasAccessToken = cookies.getItem('hasAccessToken');

//     // User has access token, use token to get userInfo from api
//     if (hasAccessToken) {
//         try {
//             const url = '';
//             const response = await fetch(url);
//             const results = await response.json();

//             // Save results to global store
//             dispatch({ type: '', payload: results });
//         } catch (err) {
//             console.log(err);
//         };
//     };
// };

// Holds global state for components to access
const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    // Check if user is logged in
    // useEffect(() => {
    //     checkUserLogggedIn(dispatch);
    // }, []);
    
    return (
        <Context.Provider value={[state, dispatch]}>
            { children }
        </Context.Provider>
    );
};

export const Context = createContext(initialState);
export default Store;