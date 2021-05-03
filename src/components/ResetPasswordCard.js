import { Fragment } from 'react';

// Material UI
import {
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    loginButton: {
        width: '100px',
        marginTop: '10px',
        float: 'right'
    },
}));

function ResetPasswordCard(props) {
    const {
        
        // Password states
        updatePassword,
        showPassword,
        updateShowPassword,
        validatePassword,
        
        // Validation and loading states
        handleSubmit,
        submitError,
        loading,

        classes
    } = props;
    const resetPasswordCardClasses = useStyles();

    return (
        <Fragment>

            {/* Password */}
            <TextField
                id='password'
                label='New password'
                variant='outlined'
                type={ showPassword ? 'text' : 'password' }
                autoComplete='off'
                classes={{ root: classes.textfield }}
                onChange={(e) => updatePassword(e.target.value)}
                error={validatePassword.hasError}
                helperText={validatePassword.errorMessage}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => updateShowPassword(!showPassword)}
                                edge="end"
                            >
                                { showPassword ? <Visibility /> : <VisibilityOff /> }
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                fullWidth
            />

            {/* Submit error message */}
            <div className='errorMessage'>{ submitError.errorMessage }</div>

            <Button
                classes={{ root: `${ classes.primaryButton } ${ resetPasswordCardClasses.loginButton }` }}
                onClick={handleSubmit}
                disabled={loading}
            >
                { loading ? <CircularProgress size={20} color='primary' /> : 'Reset' }
            </Button>
        </Fragment>
    );
};

export default ResetPasswordCard;