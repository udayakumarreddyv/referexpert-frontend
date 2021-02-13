import { useContext, useState } from 'react';
import './styles/Registrationpage.css';

// Global store
import { Context } from '../store/GlobalStore';
import { Redirect } from 'react-router-dom';

// Email validation
import * as EmailValidator from 'email-validator';

// Basic auth creation
import createBasicAuth from '../utils/basicAuth';

// Material UI
import {
    Button,
    Card,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@material-ui/core';
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

    // Input states
    const [firstName, updateFirstName] = useState('');
    const [lastName, updateLastName] = useState('');
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');
    const [confirmPassword, updateConfirmPassword] = useState('');
    const [address, updateAddress] = useState('');
    const [phone, updatePhone] = useState('');
    const [fax, updateFax] = useState('');
    const [degree, updateDegree] = useState('');
    const [type, updateType] = useState('');
    const [terms, updateTerms] = useState(false);
    const [referralCode, updateReferralCode] = useState('');

    // Validate states
    const [validateFirstName, updateValidateFirstName] = useState({ hasError: false, errorMessage: '' });
    const [validateLastName, updateValidateLastName] = useState({ hasError: false, errorMessage: '' });
    const [validateEmail, updateValidateEmail] = useState({ hasError: false, errorMessage: '' });
    const [validatePassword, updateValidatePassword] = useState({ hasError: false, errorMessage: '' });
    const [validateConfirmPassword, updateValidateConfirmPassword] = useState({ hasError: false, errorMessage: '' });
    const [validateAddress, updateValidateAddress] = useState({ hasError: false, errorMessage: '' });
    const [validatePhone, updateValidatePhone] = useState({ hasError: false, errorMessage: '' });
    const [validateFax, updateValidateFax] = useState({ hasError: false, errorMessage: '' });
    const [validateDegree, updateValidateDegree] = useState({ hasError: false, errorMessage: '' });
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
        let tempConfirmPassword = { hasError: false, errorMessage: '' };
        let tempAddress = { hasError: false, errorMessage: '' };
        let tempPhone = { hasError: false, errorMessage: '' };
        let tempFax = { hasError: false, errorMessage: '' };
        let tempDegree = { hasError: false, errorMessage: '' };
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

        // Confirm password check
        if (confirmPassword.trim() === '') {
            tempConfirmPassword = { hasError: true, errorMessage: '' };
        } else if (confirmPassword !== password) {
            tempConfirmPassword = { hasError: true, errorMessage: 'Passwords do not match' };
        };

        // Address
        if (address.trim() === '') {
            tempAddress = { hasError: true, errorMessage: '' };
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
        if (degree === '') {
            tempDegree = { hasError: true, errorMessage: '' };
        };

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
            tempPassword, tempConfirmPassword, tempAddress,
            tempPhone, tempFax, tempDegree,
            tempType, tempTerms, tempReferralCode
        };
    };

    // Update error states
    const handleErrorStates = (
        tempFirstName, tempLastName, tempEmail,
        tempPassword, tempConfirmPassword, tempAddress,
        tempPhone, tempFax, tempDegree,
        tempType, tempTerms, tempReferralCode
    ) => {
        updateValidateFirstName(tempFirstName);
        updateValidateLastName(tempLastName);
        updateValidateEmail(tempEmail);
        updateValidatePassword(tempPassword);
        updateValidateConfirmPassword(tempConfirmPassword);
        updateValidateAddress(tempAddress);
        updateValidatePhone(tempPhone);
        updateValidateFax(tempFax);
        updateValidateDegree(tempDegree);
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
                tempFirstName,tempLastName, tempEmail,
                tempPassword, tempConfirmPassword, tempAddress,
                tempPhone, tempFax, tempDegree,
                tempType, tempTerms, tempReferralCode
            } = validateInputs();

            // Update error states
            handleErrorStates(
                tempFirstName, tempLastName, tempEmail,
                tempPassword, tempConfirmPassword, tempAddress,
                tempPhone, tempFax, tempDegree,
                tempType, tempTerms, tempReferralCode
            );

            // Kill request if we found an error
            if (
                tempFirstName.hasError
                || tempLastName.hasError
                || tempEmail.hasError
                || tempPassword.hasError
                || tempConfirmPassword.hasError
                || tempAddress.hasError
                || tempPhone.hasError
                || tempFax.hasError
                || tempDegree.hasError
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
                phone,
                fax,
                degree,
                userType: type,
                userSpeciality: 'PHYSICIAN1',
                // terms
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': createBasicAuth(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postBody)
            });
            const results = await response.json();

            // Catch bad response
            if (!('message' in results)) {
                throw results;
            } else {
                const message = results.message;
                
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

                // Success message, log in user
                if (message === 'Registration Successful') {
                    // Login user on frontend
                    // TODO: Change payload to response
                    const payload = { userEmail: email, userType: 'user' };
                    dispatch({ type: 'LOGIN_USER', payload });

                    updateLoading(false);
                    return;
                };

                // Throw any unhandled error messages
                throw message;
            };
        } catch (err) {
            console.log(err);
            updateSubmitError({ hasError: true, errorMessage: 'There was an error was registering your account, please try again in a few moments'})
            updateLoading(false);
        };
    };

    // Check if user is logged in, redirect to appropriate page
    if (state.loggedIn) {
        if (state.userType === 'admin') {
            return <Redirect to='/admin' />
        } else {
            return <Redirect to='/home' />
        };
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
                />

                {/* Email */}
                <TextField
                    id='email'
                    label='Email'
                    variant='outlined'
                    type='email'
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

                {/* Confirm password */}
                <TextField
                    id='confirmPassword'
                    label='Confirm password'
                    variant='outlined'
                    type='password'
                    classes={{ root: classes.textfield }}
                    onChange={(e) => updateConfirmPassword(e.target.value)}
                    error={validateConfirmPassword.hasError}
                    helperText={validateConfirmPassword.errorMessage}
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

                {/* Degree */}
                <FormControl classes={{ root: registerpageClasses.select }}>
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
                </FormControl>

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

                {/* Referral code */}
                <TextField
                    id='referralCode'
                    label='Referral code'
                    variant='outlined'
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