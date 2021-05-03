import { useContext, useEffect, useState, Fragment } from 'react';
import './styles/Confirmpage.css';

// Global store
import { Context } from '../store/GlobalStore';
import { Redirect } from 'react-router-dom';

// Utils
import * as queryString from 'query-string';

// Material UI
import { Card, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: '430px',
        margin: '0 auto',
        padding: '30px',
        textAlign: 'center',
        [theme.breakpoints.down(400)]: {
            maxWidth: '100%',
            boxSizing: 'border-box'
        },
    },
}));

function ConfirmPage({ classes }) {
    const confirmpageClasses = useStyles();
    const [state, dispatch] = useContext(Context);

    // Validation states
    const [requestComplete, updateRequestComplete] = useState(false);
    const [submitError, updateSubmitError] = useState({ hasError: false, errorMessage: '' });

    // Confirm account with api
    const confirmAccount = async (email, token) => {
        try {
            const url = `/referexpert/confirmaccount?user=${email}&token=${token}`;
            const response = await fetch(url);
            const results = await response.json();

            // Catch unexpected response
            if (!('message' in results)) throw results;

            // Error response
            if (results.message !== 'Account Verified Successfully') {
                updateSubmitError({ hasError: true, errorMessage: 'This link is either invalid or broken' });
            };
        } catch (err) {
            console.log(err);
            updateSubmitError({ hasError: true, errorMessage: 'There was an error while confirming your account, please wait a moment and refresh the page' });
        } finally {
            updateRequestComplete(true);
        };
    };

    // Get email & token from url
    useEffect(async () => {
        const urlParams = queryString.parse(window.location.search);
        await confirmAccount(urlParams.email, urlParams.token);
    }, []);

    // Check if user is logged in, redirect to appropriate page
    if (state.loggedIn) {
        if (state.userType === 'ADMIN') {
            return <Redirect to='/admin' />
        } else {
            return <Redirect to='/home' />
        };
    };

    // Decide the view to be shown to user
    let view;
    if (!requestComplete) {
        
        // Loading
        view = <div style={{ textAlign: 'center' }}><CircularProgress size={60} /></div>
    } else if (requestComplete && submitError.hasError) {
        
        // Error while confirming account
        view = (
            <div className='errorMessage'>
                <h1>Failed to activate account</h1>
                <div>{ submitError.errorMessage }</div>
            </div>
        );
    } else {

        // Success
        view = <div>Your account has been activated and is now ready to be used!</div>;
    };

    return (
        <section id='confirmpage-body'>
            <h1 id='confirmpage-headerText'>Account confirmation</h1>
            
            <Card elevation={3} classes={{ root: confirmpageClasses.card }} justify='space-between'>
                { view }
            </Card>
        </section>
    );
};

export default ConfirmPage;