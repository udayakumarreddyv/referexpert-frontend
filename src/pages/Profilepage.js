import { Fragment, useState, useContext, useEffect } from 'react';
import './styles/Profilepage.css';

// Global store
import { Context } from '../store/GlobalStore';

// Component
import NotificationMethodsDialog from '../components/NotificationMethodsDialog';

// Material UI
import {
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Snackbar,
    TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
    AccountCircle,
    Assignment,
    Email,
    Home,
    LocalHospital,
    Phone,
    Print,
    School,
    Visibility,
    VisibilityOff,
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
    notificationButton: {
        float: 'right',
        marginRight: '10px'
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
    const [state, dispatch] = useContext(Context);
    const [loading, updateLoading] = useState(false);

    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Notification states
    const [dialogNotificationMethodsOpen, updateDialogNotificationMethodsOpen] = useState(false);
    const [notificationMethodsData, updateNotificationMethodsData] = useState(null);

    // Edit states
    const [showEdit, updateShowEdit] = useState(false);
    const [firstName, updateFirstName] = useState(state.userDetails.firstName);
    const [lastName, updateLastName] = useState(state.userDetails.lastName);
    const [address, updateAddress] = useState(state.userDetails.address);
    const [city, updateCity] = useState(state.userDetails.city);
    const [locationState, updateLocationState] = useState(state.userDetails.state);
    const [zip, updateZip] = useState(state.userDetails.zip);
    const [phone, updatePhone] = useState(state.userDetails.phone);
    const [fax, updateFax] = useState(state.userDetails.fax);
    const [userType, updateUserType] = useState(state.userDetails.userType);
    const [userSpeciality, updateUserSpeciality] = useState(state.userDetails.userSpeciality);
    const [service, updateService] = useState(state.userDetails.service);
    const [insurance, updateInsurance] = useState(state.userDetails.insurance);

    // Change password states
    const [newPassword, updateNewPassword] = useState('');
    const [passwordLoading, updatePasswordLoading] = useState(false);
    const [showPassword, updateShowPassword] = useState(false);

    // Change password validation states
    const [newPasswordValidation, updateNewPasswordValidation] = useState({ hasError: false, errorMessage: '' });
    const [submitError, updateSubmitError] = useState({ hasError: false, errorMessage: '' });

    // Fetch notification methods
    // This will let us know if we need to popup a modal to the user for them to add them
    const fetchNotifications = async () => {
        try {
            const url = 'referexpert/notification';
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` } });
            
            // Catch errors
            if (response.status !== 200) throw response;

            const results = await response.json();

            // User has not added there notification methods yet
            // We know this by the empty object that is passed
            const isEmptyObject = Object.keys(results).length === 0;
            if (isEmptyObject) {
                updateDialogNotificationMethodsOpen(true);
                console.log('user needs to add notification methods');
                return;
            };

            updateNotificationMethodsData(results);
        } catch (err) {
            updateNotificationMethodsData('error');
            console.log(err);
        };
    };

    // Save updated profile information
    const saveProfileInfo = async () => {
        try {
            
            // Show loading spinner
            updateLoading(true);

            // Send request to api
            const url = '/referexpert/userprofile';
            const newUserDetails = {
                firstName,
                lastName,
                userType,
                userSpeciality,
                address,
                city,
                state: locationState,
                zip,
                phone,
                fax,
                service,
                insurance,
                userId: state.userDetails.userId,
                email: state.userDetails.email,
                isActive: state.userDetails.isActive
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserDetails)
            });
            const results = await response.json();
            
            // Catch errors
            if (
                !('message' in results)
                || results.message === 'Issue in updating user profile'
                || results.message !== 'User profile updated Successfully'
            ) {
                throw results;
            };

            // Hide edit field screen and hide loading spinner
            updateShowEdit(false);
            updateLoading(false);

            // Update state to reflect immediate changes
            dispatch({ type: 'UPDATE_USER', payload: newUserDetails });

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

    // Handle change password submit
    const handleChangePasswordSubmit = async () => {

        // Clear any submit errors
        updateSubmitError({ hasError: false, errorMessage: '' });

        // Check new password
        let tempNewPassword = { hasError: false, errorMessage: '' };
        if (newPassword.trim() === '') {
            tempNewPassword = { hasError: true, errorMessage: '' };
        } else if (newPassword.length < 8) {
            tempNewPassword = { hasError: true, errorMessage: 'Must be at least 8 characters' };
        } else if (!newPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
            tempNewPassword = { hasError: true, errorMessage: 'Must contain at least one uppercase character, one number, and one special character' };
        };

        // Update validation states
        updateNewPasswordValidation(tempNewPassword);
        
        // Kill request if error in validation
        if (tempNewPassword.hasError) {
            updateSubmitError({ hasError: true, errorMessage: '' });
            return;
        };

        try {
            // Show loading spinner
            updatePasswordLoading(true);

            const url = '/referexpert/updatepassword';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: state.userEmail,
                    password: newPassword,
                }),
            });
            const results = await response.json();
            
            // Check if password update failed
            if (!('message' in results)) {
                throw results;
            } else if (results.message !== 'Password updated Successfully') {
                throw results;
            };

            // Show success alert
            updateAlertDetails({ type: 'success', message: 'Your password has been updated!' });
            updateAlertOpen(true);

            // Hide spinner and clear input
            updatePasswordLoading(false);
            updateNewPassword('');
        } catch(err) {
            
            // Show success alert
            updateAlertDetails({ type: 'error', message: 'Failed to update password' });
            updateAlertOpen(true);

            // Hide loading spinner
            updatePasswordLoading(false);
        };
    };

    // Launch fetch appointments, referrals, and notifications on load
    useEffect(() => {
        fetchNotifications();
    }, []);

    
    // Create united states elements 
    const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
    const statesElements = states.map((state) => <MenuItem value={state}>{ state }</MenuItem> );

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

                    {/* Notification settings button */}
                    <Button
                        classes={{ root: `${classes.primaryButton} ${profilepageClasses.notificationButton}` }}
                        onClick={() => updateDialogNotificationMethodsOpen(true)}
                    >Notification settings</Button>
                </h1>

                {/* Profile details */}
                <List classes={{ root: profilepageClasses.profileList }}>
                    
                    {/* Email */}
                    <ListItem>
                        <ListItemIcon>
                            <Email className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>{state.userDetails.email}</ListItemText>
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
                                : `${state.userDetails.firstName} ${state.userDetails.lastName}`
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
                                ? <div>

                                    {/* Address */}
                                    <TextField
                                        name='address'
                                        label='Address'
                                        variant='outlined'
                                        value={address}
                                        onChange={(event) => updateAddress(event.target.value)}
                                        style={{ marginRight: '10px', marginBottom: '15px' }}
                                    />

                                    {/* City */}
                                    <TextField
                                        name='city'
                                        label='City'
                                        variant='outlined'
                                        value={city}
                                        onChange={(event) => updateCity(event.target.value)}
                                    />

                                    {/* State */}
                                    <FormControl>
                                        <InputLabel>State</InputLabel>
                                        <Select
                                            id='locationState'
                                            value={locationState}
                                            onChange={(e) => updateLocationState(e.target.value)}
                                            style={{ marginRight: '10px' }}
                                        >
                                            { statesElements }
                                        </Select>
                                    </FormControl>

                                    {/* Zipcode */}
                                    <TextField
                                        name='zipcode'
                                        label='Zipcode'
                                        variant='outlined'
                                        value={zip}
                                        onChange={(event) => updateZip(event.target.value)}
                                        style={{ width: '100px' }}
                                    />
                                </div>
                                : `${state.userDetails.address} ${state.userDetails.city}, ${state.userDetails.state} ${state.userDetails.zip}`
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
                                : state.userDetails.phone
                            }
                        </ListItemText>
                    </ListItem>

                    {/* Fax */}
                    <ListItem>
                        <ListItemIcon>
                            <Print className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>
                            {
                                showEdit
                                ? <TextField
                                    name='fax'
                                    label='Fax'
                                    variant='outlined'
                                    value={fax}
                                    onChange={(event) => updateFax(event.target.value)}
                                />
                                : state.userDetails.fax
                            }
                        </ListItemText>
                    </ListItem>

                    {/* Degree */}
                    <ListItem>
                        <ListItemIcon>
                            <School className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>{state.userDetails.userType}</ListItemText>
                    </ListItem>

                    {/* Type */}
                    <ListItem>
                        <ListItemIcon>
                            <Work className='primaryColor' />
                        </ListItemIcon>
                        <ListItemText>{state.userDetails.userSpeciality}</ListItemText>
                    </ListItem>

                    {/* Services */}
                    <ListItem>
                        <ListItemIcon>
                            <Assignment className='primaryColor' />
                        </ListItemIcon>

                        <ListItemText>
                            {
                                showEdit
                                ? <TextField
                                    name='service'
                                    label='Services offered'
                                    variant='outlined'
                                    value={service}
                                    onChange={(event) => updateService(event.target.value)}

                                    // if character in box show counter
                                    // Else show 'Separate by commas'
                                    helperText={ service.length > 0 ? `${service.length}/250` : 'Please separate by commas' }
                                    inputProps={{ maxLength: 250 }}
                                    rows={2}
                                    multiline
                                    fullWidth
                                />
                                : state.userDetails.service
                            }
                        </ListItemText>
                    </ListItem>

                    {/* Insurance */}
                    <ListItem>
                        <ListItemIcon>
                            <LocalHospital className='primaryColor' />
                        </ListItemIcon>
                        
                        <ListItemText>
                            {
                                showEdit
                                ? <TextField
                                    name='insurance'
                                    label='Insurances covered'
                                    variant='outlined'
                                    value={insurance}
                                    onChange={(event) => updateInsurance(event.target.value)}

                                    // Else if character in box show counter
                                    // Else show 'Separate by commas'
                                    helperText={ insurance.length > 0 ? `${insurance.length}/250` : 'Please separate by commas' }
                                    inputProps={{ maxLength: 250 }}
                                    rows={2}
                                    multiline
                                    fullWidth
                                />
                                : state.userDetails.insurance
                            }
                        </ListItemText>
                    </ListItem>
                </List>

                {/* Change password section */}
                <section id='profilepage-changePasswordContainer'>
                    <h3 className='pageSubTitle'>Change password</h3>

                    {/* Password */}
                    <TextField
                        id='password'
                        label='Password'
                        variant='outlined'
                        value={newPassword}
                        type={ showPassword ? 'text' : 'password' }
                        classes={{ root: profilepageClasses.passwordInput }}
                        onChange={(e) => updateNewPassword(e.target.value)}
                        error={newPasswordValidation.hasError}
                        helperText={newPasswordValidation.errorMessage}
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

            {/* Add/Remove notification methods dialog */}
            <NotificationMethodsDialog
                classes={classes}
                token={state.token}
                updateAlertDetails={updateAlertDetails}
                updateAlertOpen={updateAlertOpen}
                notificationMethods={notificationMethodsData}
                dialogNotificationMethodsOpen={dialogNotificationMethodsOpen}
                updateDialogNotificationMethodsOpen={updateDialogNotificationMethodsOpen}
            />
        </section>
    );
};

export default Profilepage;