import { useContext, useEffect, useState, Fragment } from 'react';
// import './styles/Loginpage.css';

// Global store
import { Context } from '../store/GlobalStore';
import { Redirect } from 'react-router-dom';

// Components
import ResetPasswordCard from '../components/ResetPasswordCard';

// Utils
import * as queryString from 'query-string';
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

function ResetPasswordPage({ classes }) {
    const loginpageClasses = useStyles();
    const [state, dispatch] = useContext(Context);

    const [loading, updateLoading] = useState(false);
    const [successView, updateSuccessView] = useState(false);

    // Input states
    const [token, updateToken] = useState('');
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');

    // Validation & show/hide password states
    const [showPassword, updateShowPassword] = useState(false);
    const [validatePassword, updateValidatePassword] = useState({ hasError: false, errorMessage: '' });
    const [submitError, updateSubmitError] = useState({ hasError: false, errorMessage: '' });
    
    // Handle resetting the user's password
    const handleResetPassword = async () => {

        // Validate new password meets criteria
        if (password.trim() === '') {
            updateValidatePassword({ hasError: true, errorMessage: '' });
            return;
        } else if (password.length < 8) {
            updateValidatePassword({ hasError: true, errorMessage: 'Must be at least 8 characters' });
            return;
        } else if (!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
            updateValidatePassword({ hasError: true, errorMessage: 'Must contain at least an uppercase character, number, and special character' });
            return;
        };

        try {
            updateLoading(true);

            // Send request to api
            const url = `/referexpert/resetpassword?token=${token}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const results = await response.json();

            // Unexpected response from api
            if (!('message' in results)) throw results;

            // There is an error
            if (results.message !== 'Password updated Successfully') {
                if (results.message === 'Issue in updating user profile') {
                    updateSubmitError({ hasError: true, errorMessage: 'There was an error while updating your password, please wait a moment and try again' });
                } else if (results.message === 'The link is invalid or broken!') {
                    updateSubmitError({ hasError: true, errorMessage: 'Invalid link, please try resetting your password again' });
                };

                updateLoading(false);
                return;
            };

            // Show success view
            updateSuccessView(true);
            updateLoading(false);
        } catch (err) {
            console.log(err);
            updateLoading(false);
        };
    };

    // Get email from url
    useEffect(() => {
        const urlParams = queryString.parse(window.location.search);
        
        // Get email
        if (urlParams.email && EmailValidator.validate(urlParams.email)) {
            updateEmail(urlParams.email);
        } else {
            updateSubmitError({ hasError: true, errorMessage: 'Invalid email address, please try clicking on the email link or reset your password again' });
        };

        // Get token
        if (urlParams.token) {
            updateToken(urlParams.token);
        } else {
            updateSubmitError({ hasError: true, errorMessage: 'Invalid token, please try clicking on the email link or reset your password again' });
        };
    }, []);

    // Check if user is logged in, redirect to appropriate page
    if (state.loggedIn) {
        if (state.userType === 'ADMIN') {
            return <Redirect to='/admin' />
        } else {
            return <Redirect to='/home' />
        };
    };

    // Password update success view
    const successViewMessage = (
        <Fragment>
            <h1>Your password has been updated!</h1>
            <div>Please use your new password when logging in now</div>
        </Fragment>
    );

    // Show login card on default view
    return (
        <section id='loginpage-body'>
            <h1 id='loginpage-headerText'>Reset your password</h1>

            {/* Reset password card */}
            <Card elevation={3} classes={{ root: loginpageClasses.loginCard }} justify='space-between'>
                
                {/* Show success view or reset password view */}
                {
                    successView
                    ? successViewMessage
                    : <ResetPasswordCard
                        classes={classes}

                        // Password states
                        showPassword={showPassword}
                        updateShowPassword={updateShowPassword}
                        updatePassword={updatePassword}
                        validatePassword={validatePassword}

                        // Validation & loading states
                        handleSubmit={handleResetPassword}
                        submitError={submitError}
                        loading={loading}
                    />
                }
            </Card>
        </section>
    );
};

export default ResetPasswordPage;