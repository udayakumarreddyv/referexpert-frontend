import { Fragment, useState, useEffect } from 'react';
import './styles/Profilepage.css';

// Material UI
import {
    Button,
    CircularProgress,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Snackbar,
    TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
    AccountCircle,
    Email,
    Home,
    LocalHospital,
    Phone,
    Work,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    paperContainer: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    editButton: {
        float: 'right',
    },
    passwordInput: {
        marginBottom: '10px',
    },
    changePasswordButton: {
        marginTop: '10px',
        float: 'right',
    }
}));

function Profilepage({ classes }) {
    const profilepageClasses = useStyles();
    const [loading, updateLoading] = useState(false);

    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Edit states
    const [showEdit, updateShowEdit] = useState(false);
    const [firstName, updateFirstName] = useState('Andrew');
    const [lastName, updateLastName] = useState('Elick');
    const [address, updateAddress] = useState('123 Main Street');
    const [phone, updatePhone] = useState('901-606-5506');

    // Change password states
    const [currentPassword, updateCurrentPassword] = useState('');
    const [newPassword, updateNewPassword] = useState('');
    const [confirmPassword, updateConfirmPassword] = useState('');
    const [passwordLoading, updatePasswordLoading] = useState(false);

    // Change password validation states
    const [currentPasswordValidation, updateCurrentPasswordValidation] = useState({ hasError: false, errorMessage: '' });
    const [newPasswordValidation, updateNewPasswordValidation] = useState({ hasError: false, errorMessage: '' });
    const [confirmPasswordValidation, updateConfirmPasswordValidation] = useState({ hasError: false, errorMessage: '' });
    const [submitError, updateSubmitError] = useState({ hasError: false, errorMessage: '' });

    // Save updated profile information
    const saveProfileInfo = async () => {
        try {
            
            // Show loading spinner
            updateLoading(true);

            // Send request to api
            // const url = '';
            // const response = await fetch(url, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ firstName, lastName, address, phone })
            // });
            // const results = await response.json();
            // console.log(results);

            // Hide edit field screen and hide loading spinner
            updateShowEdit(false);
            updateLoading(false);

            // Show success alert
            updateAlertDetails({ type: 'success', message: 'Your profile information has been updated!' });
            updateAlertOpen(true);
        } catch (err) {

            // Show failed alert
            updateAlertDetails({ type: 'error', message: 'Failed to update your profile information' });
            updateAlertOpen(true);

            // Hide loading spinner
            updateLoading(false);
            console.log(err);
        };
    };

    // Handle edit button click
    const handleEditClick = () => {

        // Show edit fields if hidden
        if (!showEdit) {
            updateShowEdit(true);
            return;
        };

        // Update values on save click
        saveProfileInfo();
    };

    // Validate change password fields
    const validatePasswordFields = () => {
        let tempCurrentPassword = { hasError: false, errorMessage: '' };
        let tempNewPassword = { hasError: false, errorMessage: '' };
        let tempConfirmPassword = { hasError: false, errorMessage: '' };

        // Check current password
        if (currentPassword.trim() === '') {
            tempCurrentPassword = { hasError: true, errorMessage: '' };
        };

        // Check new password
        if (newPassword.trim() === '') {
            tempNewPassword = { hasError: true, errorMessage: '' };
        } else if (newPassword.length < 8) {
            tempNewPassword = { hasError: true, errorMessage: 'Must be at least 8 characters' };
        } else if (!newPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
            tempNewPassword = { hasError: true, errorMessage: 'Must contain at least one uppercase character, one number, and one special character' };
        };

        // Check confirm password
        if (confirmPassword.trim() === '') {
            tempConfirmPassword = { hasError: true, errorMessage: '' };
        } else if (confirmPassword !== newPassword) {
            tempConfirmPassword = { hasError: true, errorMessage: 'Passwords do not match' };
        };

        return [tempCurrentPassword, tempNewPassword, tempConfirmPassword];
    };

    // Handle change password submit
    const handleChangePasswordSubmit = async () => {

        // Clear any submit errors
        updateSubmitError({ hasError: false, errorMessage: '' });

        // Validate password fields
        const [tempCurrentPassword, tempNewPassword, tempConfirmPassword] = validatePasswordFields();

        // Update validation states
        updateCurrentPasswordValidation(tempCurrentPassword);
        updateNewPasswordValidation(tempNewPassword);
        updateConfirmPasswordValidation(tempConfirmPassword);

        // Kill request if error in validation
        if (tempCurrentPassword.hasError || tempNewPassword.hasError || tempConfirmPassword.hasError) {
            updateSubmitError({ hasError: true, errorMessage: 'Please fill out all fields' });
            return;
        };

        try {
            // Show loading spinner
            updatePasswordLoading(true);

            const url = '';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });
            const results = await response.json();

            // TODO: Check if current password was correct

            // Show success alert
            updateAlertDetails({ type: 'success', message: 'Your password has been updated!' });
            updateAlertOpen(true);

            // Hide loading spinner
            updatePasswordLoading(false);
        } catch(err) {
            
            // Show success alert
            updateAlertDetails({ type: 'error', message: 'Failed to update password' });
            updateAlertOpen(true);

            // Hide loading spinner
            updatePasswordLoading(false);
        };
    };
    
    // Default page view
    return (
        <section id='profilepage-body'>

            {/* Alert popups, only shown when user info or password is updated */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => updateAlertOpen(false)}
            >
                <Alert
                    severity={alertDetails.type}
                    variant='filled'
                    elevation={2}
                >
                    { alertDetails.message }
                </Alert>
            </Snackbar>

            <Paper elevation={2} classes={{ root: profilepageClasses.paperContainer }}>
                <h1 className='pageTitle'>
                    Profile

                    {/* Edit/Save button */}
                    <Button
                        classes={{ root: `${classes.primaryButton} ${profilepageClasses.editButton}` }}
                        onClick={handleEditClick}
                    >
                        {/* Show save button with spinner if waiting on save */}
                        { showEdit && loading ? <CircularProgress color='#FFFFFF' size={20} /> : null }

                        {/* Show save button if edit clicked and not loading yet */}
                        { showEdit && !loading ? 'Save' : null }

                        {/* Show edit button if not clicked yet */}
                        { !showEdit ? 'Edit' : null }
                    </Button>
                </h1>

                {/* Profile details */}
                <List classes={{ root: profilepageClasses.profileList }}>
                    
                    {/* Email */}
                    <ListItem>
                        <ListItemIcon>
                            <Email className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>andy.elick@gmail.com</ListItemText>
                    </ListItem>

                    {/* Name */}
                    <ListItem>
                        <ListItemIcon>
                            <AccountCircle className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>
                            {
                                showEdit
                                ? <Fragment>
                                    <TextField
                                        name='firstName'
                                        label='First name'
                                        variant='outlined'
                                        value={firstName}
                                        onChange={(event) => updateFirstName(event.target.value)}
                                        style={{ marginRight: '10px' }}
                                    />

                                    <TextField
                                        name='lastName'
                                        label='Last name'
                                        variant='outlined'
                                        value={lastName}
                                        onChange={(event) => updateLastName(event.target.value)}
                                    />
                                </Fragment>
                                : 'Andrew Elick'
                            }
                        </ListItemText>
                    </ListItem>

                    {/* Address */}
                    <ListItem>
                        <ListItemIcon>
                            <Home className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>
                            {
                                showEdit
                                ? <TextField
                                    name='address'
                                    label='Address'
                                    variant='outlined'
                                    value={address}
                                    onChange={(event) => updateAddress(event.target.value)}
                                />
                                : '123 Main street'
                            }
                        </ListItemText>
                    </ListItem>

                    {/* Phone */}
                    <ListItem>
                        <ListItemIcon>
                            <Phone className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>
                            {
                                showEdit
                                ? <TextField
                                    name='phone'
                                    label='Phone'
                                    variant='outlined'
                                    value={phone}
                                    onChange={(event) => updatePhone(event.target.value)}
                                />
                                : 'andy.elick@gmail.com'
                            }
                        </ListItemText>
                    </ListItem>

                    {/* Degree */}
                    <ListItem>
                        <ListItemIcon>
                            <LocalHospital className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>M.D</ListItemText>
                    </ListItem>

                    {/* Type */}
                    <ListItem>
                        <ListItemIcon>
                            <Work className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>Physician</ListItemText>
                    </ListItem>
                </List>

                {/* Change password section */}
                <section id='profilepage-changePasswordContainer'>
                    <h3 className='pageSubTitle'>Change password</h3>
                    
                    {/* Current password */}
                    <TextField
                        name='currentPassword'
                        label='Current password'
                        type='password'
                        variant='outlined'
                        classes={{ root: profilepageClasses.passwordInput }}
                        onChange={(event) => updateCurrentPassword(event.target.value)}
                        error={currentPasswordValidation.hasError}
                        fullWidth
                    />

                    {/* New password */}
                    <TextField
                        name='newPassword'
                        label='New password'
                        type='password'
                        variant='outlined'
                        classes={{ root: profilepageClasses.passwordInput }}
                        onChange={(event) => updateNewPassword(event.target.value)}
                        error={newPasswordValidation.hasError}
                        helperText={newPasswordValidation.errorMessage}
                        fullWidth
                    />

                    {/* Confirm password */}
                    <TextField
                        name='confirmPassword'
                        label='Confirm password'
                        type='password'
                        variant='outlined'
                        classes={{ root: profilepageClasses.passwordInput }}
                        onChange={(event) => updateConfirmPassword(event.target.value)}
                        error={confirmPasswordValidation.hasError}
                        helperText={confirmPasswordValidation.errorMessage}
                        fullWidth
                    />

                    {/* Error message */}
                    <div className='errorMessage'>{ submitError.errorMessage }</div>

                    {/* Change password button */}
                    <Button
                        name='changePasswordButton'
                        classes={{ root: `${ classes.primaryButton } ${ profilepageClasses.changePasswordButton }` }}
                        onClick={handleChangePasswordSubmit}
                    >
                        { passwordLoading ? <CircularProgress color='#FFFFFF' size={20} /> : 'Change password'}
                    </Button>
                </section>
            </Paper>
        </section>
    );
};

export default Profilepage;