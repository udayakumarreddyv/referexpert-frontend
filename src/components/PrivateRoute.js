import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from '../store/GlobalStore';

const PrivateRoute = ({ component: Component, classes, ...rest }) => {
    const [state, dispatch] = useContext(Context);

    // Redirect if user not logged in
    if (!state.loggedIn) {
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