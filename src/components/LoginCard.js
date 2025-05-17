import { Fragment } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { useNotification } from '../hooks/useNotification';
import { loginUser } from '../api/userApi';

// Material UI
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    loginButton: {
        width: '100px',
        marginTop: '10px',
        float: 'right'
    },
}));

function LoginCard({ classes }) {
    const loginCardClasses = useStyles();
    const { login } = useAuth();
    const { showNotification, NotificationComponent } = useNotification();
    
    const {
        values,
        errors,
        handleChange,
        validateForm,
        setErrors
    } = useFormValidation({
        email: '',
        password: ''
    });

    const {
        execute: executeLogin,
        status,
        error
    } = useAsync(async () => {
        if (!validateForm()) return;
        
        try {
            const response = await loginUser({
                email: values.email,
                password: values.password
            });
            
            await login(response);
        } catch (err) {
            setErrors({
                submit: err.message || 'Login failed. Please try again.'
            });
            throw err;
        }
    });

    const handleSubmit = async () => {
        try {
            await executeLogin();
        } catch (err) {
            showNotification({
                message: err.message || 'Login failed. Please try again.',
                severity: 'error'
            });
        }
    };

    return (
        <Fragment>
            {/* Email */}
            <TextField
                id='email'
                label='Email'
                variant='outlined'
                classes={{ root: classes.textfield }}
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
            />

            {/* Password */}
            <TextField
                id='password'
                label='Password'
                variant='outlined'
                type='password'
                classes={{ root: classes.textfield }}
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onKeyDown={(event) => event.key === 'Enter' ? handleSubmit() : null}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
            />

            {/* Forgot password */}
            <span
                id='loginpage-forgotPasswordLink'
                className='link'
                onClick={() => window.location.href = '/resetpass'}
            >
                Forgot password?
            </span>

            {/* Submit error message */}
            {errors.submit && (
                <div className='errorMessage'>{errors.submit}</div>
            )}

            <Button
                classes={{ root: `${classes.primaryButton} ${loginCardClasses.loginButton}` }}
                onClick={handleSubmit}
                disabled={status === 'pending'}
            >
                {status === 'pending' ? <CircularProgress size={20} color='primary' /> : 'Sign in'}
            </Button>

            <NotificationComponent />
        </Fragment>
    );
};

export default LoginCard;