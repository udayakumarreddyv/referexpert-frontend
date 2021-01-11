import { Fragment } from 'react';
import './styles/ForgotPasswordCard.css';

// Material UI
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    button: {
        width: '100px',
        marginTop: '10px',
        float: 'right'
    },
    cancelButton: {
        marginRight: '10px'
    },
    checkmarkIcon: {
        display: 'block',
        margin: '0 auto',
        marginBottom: '20px',
        fontSize: '50px',
    }
}));

function ForgotPasswordCard(props) {
    const {
        // Input values
        updateEmail,

        // View states
        passwordResetSuccess,
        handleForgotPasswordViewChange,

        // Validation and loading states
        validateEmail,
        handleSubmit,
        submitError,
        loading,

        classes
    } = props;
    const forgotPasswordCardClasses = useStyles();

    // Show success message if user submitted password reset
    if (passwordResetSuccess) {
        return (
            <Fragment>
                <CheckCircle classes={{ root: forgotPasswordCardClasses.checkmarkIcon }} className='primaryColor' />
                <div id='forgotPasswordCard-resetText'>Success! We have sent you a confirmation email to reset your password!</div>
            </Fragment>
        );
    };

    // Default view to reset password
    return (
        <Fragment>
            <div id='forgotPasswordCard-resetText'>Enter your email address and we will send you a message to reset your password</div>
            
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

            {/* Submit error message */}
            <div className='errorMessage'>{ submitError.errorMessage }</div>

            {/* Submit button */}
            <Button
                classes={{ root: `${ classes.primaryButton } ${ forgotPasswordCardClasses.button }` }}
                onClick={handleSubmit}
                disabled={loading}
            >
                { loading ? <CircularProgress size={20} color='primary' /> : 'Send' }
            </Button>

            {/* Cancel button */}
            <Button
                classes={{ root: `${ forgotPasswordCardClasses.button } ${ forgotPasswordCardClasses.cancelButton }` }}
                onClick={() => handleForgotPasswordViewChange(false)}
            >
                Cancel
            </Button>
        </Fragment>
    );
};

export default ForgotPasswordCard;