import { useState } from 'react';
import './styles/Loginpage.css';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/userSlice';

// Routing
import { Redirect, useLocation } from 'react-router-dom';

// Components
import LoginCard from '../components/LoginCard';
import ForgotPasswordCard from '../components/ForgotPasswordCard';

// Apis
import { getUserInfo, loginUser as loginUserApi, resetPassword } from '../api/userApi';
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
    const dispatch = useDispatch();
    const location = useLocation();
    
    // Get authentication state from Redux
    const { loggedIn, userType } = useSelector(state => state.user);

    // Loading states
    const [loading, updateLoading] = useState(false);

    // Input states
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');

    // Validation states
    const [validateEmail, updateValidateEmail] = useState({ hasError: false, errorMessage: '' });
    const [validatePassword, updateValidatePassword] = useState({ hasError: false, errorMessage: '' });
    const [submitError, updateSubmitError] = useState({ hasError: false, errorMessage: '' });

    // View states
    const [showForgotPasswordView, updateShowForgotPasswordView] = useState(false);

    // Validate the form fields
    const validateFields = () => {
        // Clear previous validation
        updateValidateEmail({ hasError: false, errorMessage: '' });
        updateValidatePassword({ hasError: false, errorMessage: '' });
        updateSubmitError({ hasError: false, errorMessage: '' });
        
        let hasError = false;
        if (!EmailValidator.validate(email)) {
            updateValidateEmail({ hasError: true, errorMessage: 'Please enter a valid email' });
            hasError = true;
        };
        
        if (password.trim() === '') {
            updateValidatePassword({ hasError: true, errorMessage: 'Please enter your password' });
            hasError = true;
        };

        return !hasError;
    };

    // Handle submit of login form
    const handleSubmit = async () => {
        try {
            // Validate form
            if (!validateFields()) return;

            // Update loading state
            updateLoading(true);
            
            // Send login request
            const results = await loginUserApi({ email, password });
            
            // Make sure results have keys we need
            const requiredKeys = ['accessToken', 'refreshToken', 'tokenType'];
            if (!requiredKeys.every((key) => Object.keys(results).includes(key))) {
                throw new Error('Missing required keys in response');
            };

            // Get user info using new access token
            const userInfo = await getUserInfo({ token: results.accessToken });
            const pendingTasks = await fetchPendingTasks(results.accessToken);
            
            // Update cookies
            const accessCookie = { token: results.accessToken };
            const refreshCookie = { token: results.refreshToken };
            CookieHelper.saveCookie('accessCookie', accessCookie);
            CookieHelper.saveCookie('refreshCookie', refreshCookie);
            
            // Update global state with user info
            dispatch(loginUser({
                token: results.accessToken,
                userEmail: userInfo.email,
                userType: userInfo.userType,
                userDetails: userInfo,
                pendingTasks
            }));
        } catch (err) {
            console.error(err);
            updateSubmitError({ hasError: true, errorMessage: 'Invalid email or password' });
            updateLoading(false);
        };
    };

    // Handle submit of reset password form
    const handleResetPasswordSubmit = async () => {
        try {
            // Validate form
            if (!EmailValidator.validate(email)) {
                updateValidateEmail({ hasError: true, errorMessage: 'Please enter a valid email' });
                return;
            };

            // Update loading state
            updateLoading(true);
            
            // Send reset password request
            await resetPassword({ email });
            
            // Update view state
            updateShowForgotPasswordView(true);
        } catch (err) {
            console.error(err);
            updateSubmitError({ hasError: true, errorMessage: 'Failed to reset password' });
            updateLoading(false);
        };
    };

    // Redirect if user is already logged in
    if (loggedIn) {
        const { from } = location.state || { from: { pathname: userType === 'ADMIN' ? '/admin' : '/home' } };
        return <Redirect to={from} />;
    };

    return (
        <section id='loginpage-body'>
            <Card classes={{ root: loginpageClasses.loginCard }}>
                {
                    showForgotPasswordView
                    ? <ForgotPasswordCard
                        updateEmail={updateEmail}
                        handleForgotPasswordViewChange={updateShowForgotPasswordView}
                        validateEmail={validateEmail}
                        handleSubmit={handleResetPasswordSubmit}
                        submitError={submitError}
                        loading={loading}
                        classes={classes}
                    />
                    : <LoginCard
                        updateEmail={updateEmail}
                        updatePassword={updatePassword}
                        handleForgotPasswordViewChange={updateShowForgotPasswordView}
                        validateEmail={validateEmail}
                        validatePassword={validatePassword}
                        handleSubmit={handleSubmit}
                        submitError={submitError}
                        loading={loading}
                        classes={classes}
                    />
                }
            </Card>
        </section>
    );
}

export default Loginpage;