import { useContext, useEffect, useState } from 'react';
import './styles/Loginpage.css';

// Global store
import { Context } from '../store/GlobalStore';
import { Redirect } from 'react-router-dom';

// Components
import LoginCard from '../components/LoginCard';
import ForgotPasswordCard from '../components/ForgotPasswordCard';

// Apis
import { getUserInfo, loginUser, resetPassword } from '../api/userApi';
import { fetchPendingTasks } from '../api/pendingTasksApi';

// Utils
import CookieHelper from '../utils/cookieHelper';
import * as EmailValidator from 'email-validator';

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
        } else if (!EmailValidator.validate(email)) {
            hasError = true;
            updateValidateEmail({ hasError: true, errorMessage: 'Please enter a valid email account' });
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

            // Make api call to try to validate user credentials
            const results = await loginUser({ email, password });

            // Invalid login credentials
            if (results === 'Unauthorized') {
                updateSubmitError({ hasError: true, errorMessage: 'Invalid username & password combination' });
                updateLoading(false);
                return;
            };

            // Make sure we got all creds we need
            const requiredKeys = ['accessToken', 'refreshToken', 'tokenType'];
            if (!requiredKeys.every((neededKey) => Object.keys(results).includes(neededKey))) {
                throw 'Missing a required key in body login of response';
            };

            // Get user details
            const { accessToken, refreshToken, tokenType } = results;
            const userDetails = await getUserInfo({ token: accessToken});
            const pendingTasks = await fetchPendingTasks(accessToken);
            const payload = {
                token: accessToken,
                userEmail: userDetails.email,
                userType: userDetails.userType,
                userDetails,
                pendingTasks
            };

            // Save cookie, update state to login user
            CookieHelper.saveCookie('accessCookie', { token: accessToken });
            CookieHelper.saveCookie('refreshCookie', { token: refreshToken });
            dispatch({ type: 'LOGIN_USER', payload });

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
            updateValidateEmail({ hasError: true, errorMessage: 'Please fill out field' });
            updateSubmitError({ hasError: true, errorMessage: '' });
            return;
        } else if (!EmailValidator.validate(email)) {
            updateValidateEmail({ hasError: true, errorMessage: 'Please enter a valid email account' });
            updateSubmitError({ hasError: true, errorMessage: '' });
            return;
        };

        try {
            // Show loading spinner, disable button
            updateLoading(true);

            // Send api request
            await resetPassword({ email });

            // TODO: Handle successful password reset
            updatePasswordResetSuccess(true);
            updateLoading(false);
        } catch (err) {
            console.log(err);
            updateSubmitError({ hasError: true, errorMessage: 'There was an error while trying to reset your password, please wait a moment and try again later' });
            updateLoading(false);
        };
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
        if (state.userType === 'ADMIN') {
            return <Redirect to='/admin' />
        } else {
            return <Redirect to='/home' />
        };
    };

    // Show login card on default view
    return (
        <section id='loginpage-body'>
            <h1 id='loginpage-headerText'>Sign in to <span className='logoText'>Cephalad</span></h1>

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