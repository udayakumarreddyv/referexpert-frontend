import { useContext, useState, useEffect } from 'react';
import './styles/Registrationpage.css';

// Global store
import { Context } from '../store/GlobalStore';
import { Redirect } from 'react-router-dom';

// Utils
import * as queryString from 'query-string';
import * as EmailValidator from 'email-validator';

// Material UI
import {
    Button,
    Card,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    checkbox: {
        width: '100%',
    },
    signUpCard: {
        maxWidth: '430px',
        margin: '0 auto',
        padding: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        [theme.breakpoints.down(400)]: {
            maxWidth: '100%',
            boxSizing: 'border-box'
        },
    },
    select: {
        width: '45%',
        marginBottom: '10px',
    },
    signUpButton: {
        width: '125px',
        marginTop: '20px',
        marginLeft: 'auto',
    },
}));

function Registerpage({ classes }) {
    const registerpageClasses = useStyles();
    const [state, dispatch] = useContext(Context);
    const [loading, updateLoading] = useState(false);
    const [signUpSuccessView, updateSignUpSuccessView] = useState(false);
    const [showPassword, updateShowPassword] = useState(false);

    // Input states
    const [firstName, updateFirstName] = useState('');
    const [lastName, updateLastName] = useState('');
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');
    const [address, updateAddress] = useState('');
    const [city, updateCity] = useState('');
    const [locationState, updateLocationState] = useState('');
    const [zipcode, updateZipcode] = useState('');
    const [phone, updatePhone] = useState('');
    const [fax, updateFax] = useState('');
    // const [degree, updateDegree] = useState('');
    const [type, updateType] = useState('');
    const [terms, updateTerms] = useState(false);
    const [referralCode, updateReferralCode] = useState('');

    // Validate states
    const [validateFirstName, updateValidateFirstName] = useState({ hasError: false, errorMessage: '' });
    const [validateLastName, updateValidateLastName] = useState({ hasError: false, errorMessage: '' });
    const [validateEmail, updateValidateEmail] = useState({ hasError: false, errorMessage: '' });
    const [validatePassword, updateValidatePassword] = useState({ hasError: false, errorMessage: '' });
    const [validateAddress, updateValidateAddress] = useState({ hasError: false, errorMessage: '' });
    
    const [validateCity, updateValidateCity] = useState({ hasError: false, errorMessage: '' });
    const [validateLocationState, updateValidateLocationState] = useState({ hasError: false, errorMessage: '' });

    const [validateZipcode, updateValidateZipcode] = useState({ hasError: false, errorMessage: '' });
    const [validatePhone, updateValidatePhone] = useState({ hasError: false, errorMessage: '' });
    const [validateFax, updateValidateFax] = useState({ hasError: false, errorMessage: '' });
    // const [validateDegree, updateValidateDegree] = useState({ hasError: false, errorMessage: '' });
    const [validateType, updateValidateType] = useState({ hasError: false, errorMessage: '' });
    const [validateTerms, updateValidateTerms] = useState({ hasError: false, errorMessage: '' });
    const [validateReferralCode, updateValidateReferralCode] = useState({ hasError: false, errorMessage: '' });

    // Submit states
    const [submitError, updateSubmitError] = useState({ hasError: false, errorMessage: '' });

    // Validate inputs
    const validateInputs = () => {
        let tempFirstName = { hasError: false, errorMessage: '' };
        let tempLastName = { hasError: false, errorMessage: '' };
        let tempEmail = { hasError: false, errorMessage: '' };
        let tempPassword = { hasError: false, errorMessage: '' };
        let tempAddress = { hasError: false, errorMessage: '' };
        let tempCity = { hasError: false, errorMessage: '' };
        let tempLocationState = { hasError: false, errorMessage: '' };
        let tempZipcode = { hasError: false, errorMessage: '' };
        let tempPhone = { hasError: false, errorMessage: '' };
        let tempFax = { hasError: false, errorMessage: '' };
        // let tempDegree = { hasError: false, errorMessage: '' };
        let tempType = { hasError: false, errorMessage: '' };
        let tempTerms = { hasError: false, errorMessage: '' };
        let tempReferralCode = { hasError: false, errorMessage: '' };

        // First name check
        if (firstName.trim() === '') {
            tempFirstName = { hasError: true, errorMessage: '' };
        } else if (!firstName.match(/^[A-Za-z]+$/)) {
            tempFirstName = { hasError: true, errorMessage: 'Must contain only letters' };
        };

        // Last name check
        if (lastName.trim() === '') {
            tempLastName = { hasError: true, errorMessage: '' };
        } else if (!lastName.match(/^[A-Za-z]+$/)) {
            tempLastName = { hasError: true, errorMessage: 'Must contain only letters' };
        };

        // Email check
        if (email.trim() === '') {
            tempEmail = { hasError: true, errorMessage: '' };
        } else if (!EmailValidator.validate(email)) {
            tempEmail = { hasError: true, errorMessage: 'Invalid format for email' };
        };

        // Password check
        if (password.trim() === '') {
            tempPassword = { hasError: true, errorMessage: '' };
        } else if (password.length < 8) {
            tempPassword = { hasError: true, errorMessage: 'Must be at least 8 characters' };
        } else if (!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
            tempPassword = { hasError: true, errorMessage: 'Must contain at least an uppercase character, number, and special character' };
        };

        // Address
        if (address.trim() === '') {
            tempAddress = { hasError: true, errorMessage: '' };
        };

        // City
        if (city.trim() === '') {
            tempCity = { hasError: true, errorMessage: '' };
        };

        // State
        if (state === '') {
            tempLocationState = { hasError: true, errorMessage: '' };
        };

        // Zipcode
        if (zipcode.trim() === '') {
            tempZipcode = { hasError: true, errorMessage: '' };
        } else if (!zipcode.match(/^[0-9]+$/)) {
            tempZipcode = { hasError: true, errorMessage: 'Must only be numbers' };
        } else if (zipcode.length !== 5) {
            tempZipcode = { hasError: true, errorMessage: 'Must be 5 characters long' };
        };

        // Phone
        if (phone.trim() === '') {
            tempPhone = { hasError: true, errorMessage: '' };
        } else if (!phone.match(/^[0-9]+$/)) {
            tempPhone = { hasError: true, errorMessage: 'Must contain only numbers' };
        } else if (phone.length !== 10) {
            tempPhone = { hasError: true, errorMessage: 'Must be a 10 digit phone number' };
        };

        // Fax
        if (fax.trim() === '') {
            tempFax = { hasError: true, errorMessage: '' };
        } else if (!fax.match(/^[0-9]+$/)) {
            tempFax = { hasError: true, errorMessage: 'Must contain only numbers' };
        } else if (fax.length !== 10) {
            tempFax = { hasError: true, errorMessage: 'Must be a 10 digit phone number' };
        };

        // Degree
        // if (degree === '') {
        //     tempDegree = { hasError: true, errorMessage: '' };
        // };

        // Type
        if (type === '') {
            tempType = { hasError: true, errorMessage: '' };
        };

        // Terms
        if (!terms) {
            tempTerms = { hasError: true, errorMessage: '' };
        };

        // Referral code
        if (referralCode.trim() === '') {
            tempReferralCode = { hasError: true, errorMessage: '' };
        };

        return {
            tempFirstName, tempLastName, tempEmail,
            tempPassword, tempAddress, tempCity, 
            tempLocationState, tempZipcode,
            tempPhone, tempFax, // tempDegree,
            tempType, tempTerms, tempReferralCode
        };
    };

    // Update error states
    const handleErrorStates = (
        tempFirstName, tempLastName, tempEmail,
        tempPassword, tempAddress, tempCity,
        tempLocationState, tempZipcode,
        tempPhone, tempFax, // tempDegree,
        tempType, tempTerms, tempReferralCode
    ) => {
        updateValidateFirstName(tempFirstName);
        updateValidateLastName(tempLastName);
        updateValidateEmail(tempEmail);
        updateValidatePassword(tempPassword);
        updateValidateAddress(tempAddress);
        updateValidateCity(tempCity);
        updateValidateLocationState(tempLocationState);
        updateValidateZipcode(tempZipcode);
        updateValidatePhone(tempPhone);
        updateValidateFax(tempFax);
        // updateValidateDegree(tempDegree);
        updateValidateType(tempType);
        updateValidateTerms(tempTerms);
        updateValidateReferralCode(tempReferralCode);
    };

    // Handle form submit
    const handleSubmit = async () => {
        
        // Clear error message, show loading spinner, disable button
        updateSubmitError({ hasError: false, errorMessage: '' });
        updateLoading(true);

        try {

            // Validate inputs
            const {
                tempFirstName, tempLastName, tempEmail,
                tempPassword, tempAddress, tempCity,
                tempLocationState, tempZipcode,
                tempPhone, tempFax, // tempDegree,
                tempType, tempTerms, tempReferralCode
            } = validateInputs();

            // Update error states
            handleErrorStates(
                tempFirstName, tempLastName, tempEmail,
                tempPassword, tempAddress, tempCity,
                tempLocationState, tempZipcode,
                tempPhone, tempFax, // tempDegree,
                tempType, tempTerms, tempReferralCode
            );

            // Kill request if we found an error
            if (
                tempFirstName.hasError
                || tempLastName.hasError
                || tempEmail.hasError
                || tempPassword.hasError
                || tempAddress.hasError
                || tempCity.hasError
                || tempLocationState.hasError
                || tempZipcode.hasError
                || tempPhone.hasError
                || tempFax.hasError
                // || tempDegree.hasError
                || tempType.hasError
                || tempReferralCode.hasError
            ) {
                // Update submit error, hide loading spinner, enable button
                updateSubmitError({ hasError: true, errorMessage: 'Please correct the above errors' })
                updateLoading(false);
                return;
            } else if (tempTerms.hasError) {
                // Update submit error, hide loading spinner, enable button
                updateSubmitError({ hasError: true, errorMessage: 'Please accept our terms of service' })
                updateLoading(false);
                return;
            };

            // Send request to api
            const url = `/referexpert/registeruser?referralid=${referralCode}`;
            const postBody = {
                firstName,
                lastName,
                email,
                password,
                address,
                city,
                state: locationState,
                zip: zipcode,
                phone,
                fax,
                // degree,
                userType: type,
                userSpeciality: 'PHYSICIAN1',
                // terms
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postBody)
            });
            const registrationResults = await response.json();

            // Catch bad response
            if (!('message' in registrationResults)) {
                throw registrationResults;
            } else {
                const message = registrationResults.message;
                
                // Catch errors
                if (message === 'The link is invalid or broken!') {
                    updateSubmitError({ hasError: true, errorMessage: 'The referral code is either invalid or expired' });
                    updateLoading(false);
                    return;
                } else if (message === 'User Already Exists') {
                    updateSubmitError({ hasError: true, errorMessage: 'An account with this email already exists' });
                    updateLoading(false);
                    return;
                };

                // Error that resulted in invalid registration
                if (message !== 'Registration Successful') throw message;

                // Show success message to user
                updateSignUpSuccessView(true);
            };
        } catch (err) {
            console.log(err);
            updateSubmitError({ hasError: true, errorMessage: 'There was an error was registering your account, please try again in a few moments'})
            updateLoading(false);
        };
    };

    // Get url params if coming from referral link
    useEffect(() => {
        const urlParams = queryString.parse(window.location.search);
        
        // Get email
        if (urlParams.email && EmailValidator.validate(urlParams.email)) {
            updateEmail(urlParams.email);
        };

        // Get token
        if (urlParams.token) {
            updateReferralCode(urlParams.token);
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

    // Create united states elements 
    const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
    const statesElements = states.map((state) => <MenuItem value={state}>{ state }</MenuItem> );

    // Show user that they have successfully signed up
    // Tell them that they need to confirm their account
    if (signUpSuccessView) {
        return (
            <section id='registerpage-body'>
            <h1 id='registerpage-headerText'>Join <span className='logoText'>ReferExpert</span></h1>

            <Card elevation={3} classes={{ root: registerpageClasses.signUpCard }}>
                <h1>Your account has been created!</h1>
                Please check your email for a confirmation link to complete your account setup.
            </Card>
        </section>
        );
    };

    return (
        <section id='registerpage-body'>
            <h1 id='registerpage-headerText'>Join <span className='logoText'>ReferExpert</span></h1>

            <Card elevation={3} classes={{ root: registerpageClasses.signUpCard }}>
                
                {/* First Name */}
                <TextField
                    id='firstName'
                    label='First name'
                    variant='outlined'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateFirstName(e.target.value)}
                    error={validateFirstName.hasError}
                    helperText={validateFirstName.errorMessage}
                    fullWidth
                />

                {/* Last Name */}
                <TextField
                    id='lastName'
                    label='Last name'
                    variant='outlined'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateLastName(e.target.value)}
                    error={validateLastName.hasError}
                    helperText={validateLastName.errorMessage}
                    fullWidth
                />

                {/* Email */}
                <TextField
                    id='email'
                    label='Email'
                    variant='outlined'
                    type='email'
                    value={email}
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
                    type={ showPassword ? 'text' : 'password' }
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

                {/* Address */}
                <TextField
                    id='address'
                    label='Address'
                    variant='outlined'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateAddress(e.target.value)}
                    error={validateAddress.hasError}
                    helperText={validateAddress.errorMessage}
                    fullWidth
                />

                {/* City */}
                <TextField
                    id='city'
                    label='City'
                    variant='outlined'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateCity(e.target.value)}
                    error={validateCity.hasError}
                    helperText={validateCity.errorMessage}
                    fullWidth
                />

                {/* State */}
                <FormControl classes={{ root: registerpageClasses.select }}>
                    <InputLabel>State</InputLabel>
                    <Select
                        id='state'
                        value={locationState}
                        onChange={(e) => updateLocationState(e.target.value)}
                        error={validateLocationState.hasError}
                        helperText={validateLocationState.errorMessage}
                    >
                        { statesElements }
                    </Select>
                </FormControl>

                {/* Zipcode */}
                <TextField
                    id='zipcode'
                    label='Zipcode'
                    variant='outlined'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateZipcode(e.target.value)}
                    error={validateZipcode.hasError}
                    helperText={validateZipcode.errorMessage}
                />

                {/* Phone */}
                <TextField
                    id='phone'
                    label='Phone'
                    variant='outlined'
                    type='tel'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updatePhone(e.target.value)}
                    error={validatePhone.hasError}
                    helperText={validatePhone.errorMessage}
                    fullWidth
                />

                {/* Fax */}
                <TextField
                    id='fax'
                    label='Fax'
                    variant='outlined'
                    type='tel'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateFax(e.target.value)}
                    error={validateFax.hasError}
                    helperText={validateFax.errorMessage}
                    fullWidth
                />

                {/* Type */}
                <FormControl classes={{ root: registerpageClasses.select }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        id='type'
                        value={type}
                        onChange={(e) => updateType(e.target.value)}
                        error={validateType.hasError}
                        helperText={validateType.errorMessage}
                    >
                        <MenuItem value='PHYSICIAN'>Physician</MenuItem>
                        <MenuItem value='SPECIALIST'>Specialist</MenuItem>
                    </Select>
                </FormControl>

                {/* Degree */}
                {/* <FormControl classes={{ root: registerpageClasses.select }}>
                    <InputLabel>Degree</InputLabel>
                    <Select
                        id='degree'
                        value={degree}
                        onChange={(e) => updateDegree(e.target.value)}
                        error={validateDegree.hasError}
                        helperText={validateDegree.errorMessage}
                    >
                        <MenuItem value='MD'>MD</MenuItem>
                        <MenuItem value='DDS'>DDS</MenuItem>
                        <MenuItem value='DMD'>DMD</MenuItem>
                    </Select>
                </FormControl> */}

                {/* Referral code */}
                <TextField
                    id='referralCode'
                    label='Referral code'
                    variant='outlined'
                    value={referralCode}
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateReferralCode(e.target.value)}
                    error={validateReferralCode.hasError}
                    helperText={validateReferralCode.errorMessage}
                    fullWidth
                />

                {/* Agree to terms */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={terms}
                            onChange={() => updateTerms(!terms)}
                            name='terms'
                            error={validateTerms.hasError}
                            helperText={validateTerms.errorMessage}
                        />
                    }
                    label='I agree to the terms of service'
                    classes={{ root: registerpageClasses.checkbox }}
                />

                {/* Submit error message */}
                <div className='errorMessage'>{ submitError.errorMessage }</div>

                <Button
                    classes={{ root: `${ classes.primaryButton } ${ registerpageClasses.signUpButton }` }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    { loading ? <CircularProgress size={20} color='primary' /> : 'Sign up' }
                </Button>
            </Card>
        </section>
    );
};

export default Registerpage;