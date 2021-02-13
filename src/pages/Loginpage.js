import { useContext, useEffect, useState } from 'react';
import './styles/Loginpage.css';

// Global store
import { Context } from '../store/GlobalStore';
import { Redirect } from 'react-router-dom';

// Components
import LoginCard from '../components/LoginCard';
import ForgotPasswordCard from '../components/ForgotPasswordCard';

// Utils
import createBasicAuth from '../utils/basicAuth';

// Material UI
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    loginCard: {
        maxWidth: '430px',
        margin: '0 auto',
        padding: '30px',
        [theme.breakpoints.down(400)]: {
            maxWidth: '100%',
            boxSizing: 'border-box'
        },
    },
}));

function Loginpage({ classes }) {
    const loginpageClasses = useStyles();
    const [state, dispatch] = useContext(Context);

    const [loading, updateLoading] = useState(false);

    // Password reset states
    const [showForgotPasswordCard, updateShowForgotPasswordCard] = useState(false);
    const [passwordResetSuccess, updatePasswordResetSuccess] = useState(false);

    // Input states
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');

    // Validation states
    const [validateEmail, updateValidateEmail] = useState({ hasError: false, errorMessage: '' });
    const [validatePassword, updateValidatePassword] = useState({ hasError: false, errorMessage: '' });
    const [submitError, updateSubmitError] = useState({ hasError: false, errorMessage: '' });

    // Handle login attempt
    const handleLogin = async () => {
    
        // Clear submit error
        updateValidateEmail({ hasError: false, errorMessage: '' });
        updateValidatePassword({ hasError: false, errorMessage: '' });
        updateSubmitError({ hasError: false, errorMessage: '' });

        // Validate inputs
        let hasError = false;
        if (email.trim() === '') {
            hasError = true;
            updateValidateEmail({ hasError: true, errorMessage: '' });
        };
        if (password.trim() === '') {
            hasError = true;
            updateValidatePassword({ hasError: true, errorMessage: '' });
        };

        // Kill request if caught an validation errors
        if (hasError) {
            updateSubmitError({ hasError: true, errorMessage: 'Please fill out both fields' });
            return;
        };

        try {
            // Show loading spinner, disable button
            updateLoading(true);

            const url = '/referexpert/validateuser';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': createBasicAuth(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const results = await response.json();
            
            // Make sure we got a success response
            if ('message' in results) {
                
                // Validate if login was successful or not
                if (results.message === 'Invalid Username/Password') {
                    updateSubmitError({ hasError: true, errorMessage: 'Invalid username & password combination' });
                } else if (results.message === 'User Exists') {

                    // Login user on frontend
                    // TODO: Change payload to response
                    const payload = { userEmail: email, userType: 'admin' };
                    dispatch({ type: 'LOGIN_USER', payload });
                };

                // Hide loading spinner
                updateLoading(false);
            } else {
                // Got a response that we didn't expect
                throw results;
            };
        } catch (err) {
            console.log(err);
            updateLoading(false);
            updateSubmitError({ hasError: true, errorMessage: 'There was an error while logging in with our server, please try again in a moment' });
        };
    };

    // Handle password reset request
    const handlePasswordReset = async () => {

        // Clear errors
        updateValidateEmail({ hasError: false, errorMessage: '' });
        updateSubmitError({ hasError: false, errorMessage: '' });

        // Catch validation errors
        if (email.trim() === '') {
            updateValidateEmail({ hasError: true, errorMessage: '' });
            updateSubmitError({ hasError: true, errorMessage: 'Please fill out field' });
            return;
        };

        try {
            // Show loading spinner, disable button
            updateLoading(true);

            // Send api request
            const url = '';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const results = response.json();
            console.log(results);

            // TODO: Handle successful password reset
            updatePasswordResetSuccess(true);
            updateLoading(false);
        } catch (err) {
            console.log(err);

            // TODO: Handle failed attempts here
        }
    };

    // Handle forgot password card view change
    const handleForgotPasswordViewChange = (view) => {
        
        // Clear input and validation states
        updateEmail('');
        updatePassword('');
        updateValidateEmail({ hasError: false, errorMessage: '' });
        updateValidatePassword({ hasError: false, errorMessage: '' });
        updateSubmitError({ hasError: false, errorMessage: '' });

        // Show/hide forgot password card
        updateShowForgotPasswordCard(view);
    };
    
    // Show forgot password card if user clicked forgot password link
    if (showForgotPasswordCard) {
        return (
            <section id='loginpage-body'>
                <h1 id='loginpage-headerText'>Reset your password</h1>

                <Card elevation={3} classes={{ root: loginpageClasses.loginCard }} justify='space-between'>
                    
                    {/* Forgot password card */}
                    <ForgotPasswordCard
                        classes={classes}

                        // Input states
                        updateEmail={updateEmail}

                        // Forgot password view
                        passwordResetSuccess={passwordResetSuccess}
                        handleForgotPasswordViewChange={handleForgotPasswordViewChange}

                        // Validation & loading states
                        validateEmail={validateEmail}
                        handleSubmit={handlePasswordReset}
                        submitError={submitError}
                        loading={loading}
                    />
                </Card>
            </section>
        );
    };

    // Check if user is logged in, redirect to appropriate page
    if (state.loggedIn) {
        if (state.userType === 'admin') {
            return <Redirect to='/admin' />
        } else {
            return <Redirect to='/home' />
        };
    };

    // Show login card on default view
    return (
        <section id='loginpage-body'>
            <h1 id='loginpage-headerText'>Sign in to <span className='logoText'>ReferExpert</span></h1>

            <Card elevation={3} classes={{ root: loginpageClasses.loginCard }} justify='space-between'>
                
                {/* Login card */}
                <LoginCard
                    classes={classes}

                    // Input states
                    updateEmail={updateEmail}
                    updatePassword={updatePassword}

                    // Forgot password
                    handleForgotPasswordViewChange={handleForgotPasswordViewChange}

                    // Validation & loading states
                    validateEmail={validateEmail}
                    validatePassword={validatePassword}
                    handleSubmit={handleLogin}
                    submitError={submitError}
                    loading={loading}
                />
            </Card>
        </section>
    );
};

export default Loginpage;