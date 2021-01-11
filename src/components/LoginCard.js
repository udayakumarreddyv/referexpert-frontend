import { Fragment } from 'react';

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

function LoginCard(props) {
    const {
        // Input values
        updateEmail,
        updatePassword,

        // Forgot password
        handleForgotPasswordViewChange,

        // Validation and loading states
        validateEmail,
        validatePassword,
        handleSubmit,
        submitError,
        loading,

        classes
    } = props;
    const loginCardClasses = useStyles();

    return (
        <Fragment>
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
            <span
                id='loginpage-forgotPasswordLink'
                className='link'
                onClick={() => handleForgotPasswordViewChange(true)}
            >
                Forgot password?
            </span>

            {/* Submit error message */}
            <div className='errorMessage'>{ submitError.errorMessage }</div>

            <Button
                classes={{ root: `${ classes.primaryButton } ${ loginCardClasses.loginButton }` }}
                onClick={handleSubmit}
                disabled={loading}
            >
                { loading ? <CircularProgress size={20} color='primary' /> : 'Sign in' }
            </Button>
        </Fragment>
    );
};

export default LoginCard;