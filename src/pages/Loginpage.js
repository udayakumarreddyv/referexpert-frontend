import { useState } from 'react';
import './styles/Loginpage.css';

// Material UI
import {
    Button,
    Card,
    CircularProgress,
    TextField,
} from '@material-ui/core';
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
    loginButton: {
        width: '100px',
        marginTop: '10px',
        float: 'right'
    },
}));

function Loginpage({ classes }) {
    const loginpageClasses = useStyles();
    const [loading, updateLoading] = useState(false);

    // Input states
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');

    // Validation states
    const [validateEmail, updateValidateEmail] = useState({ hasError: false, errorMessage: '' });
    const [validatePassword, updateValidatePassword] = useState({ hasError: false, errorMessage: '' });
    const [submitError, updateSubmitError] = useState({ hasError: false, errorMessage: '' });

    // Handle login attempt
    const handleSubmit = async () => {
        // Clear submit error
        updateSubmitError({ hasError: true, errorMessage: '' });

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

            const url = '';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const results = await response.json();
            console.log(results)

            // TODO: Handle successful login
            updateLoading(false);
        } catch (err) {
            console.log(err);
            updateLoading(false);

            // TODO: Put error handling for a failed login attempt
        };
    };

    return (
        <section id='loginpage-body'>
            <h1 id='loginpage-headerText'>Sign in to <span className='logoText'>ReferExpert</span></h1>

            <Card elevation={3} classes={{ root: loginpageClasses.loginCard }} justify='space-between'>
                
                {/* Email */}
                <TextField
                    id='email'
                    label='Email'
                    variant='outlined'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateEmail(e.target.value)}
                    error={validateEmail.hasError}
                    helperText={validateEmail.errorMessage}
                    fullWidth
                />

                {/* Password */}
                <TextField
                    id='password'
                    label='Password'
                    variant='outlined'
                    type='password'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updatePassword(e.target.value)}
                    error={validatePassword.hasError}
                    helperText={validatePassword.errorMessage}
                    fullWidth
                />

                {/* Forgot password */}
                <span id='loginpage-forgotPasswordLink' className='link'>Forgot password?</span>

                {/* Submit error message */}
                <div className='errorMessage'>{ submitError.errorMessage }</div>

                <Button
                    classes={{ root: `${ classes.primaryButton } ${ loginpageClasses.loginButton }` }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    { loading ? <CircularProgress size={20} color='primary' /> : 'Sign in' }
                </Button>
            </Card>
        </section>
    );
};

export default Loginpage;