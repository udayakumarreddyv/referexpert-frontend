import { useEffect, useState } from 'react';

// Utils
import EmailValidator from 'email-validator'; // validate emails
import MuiPhoneNumber from 'material-ui-phone-number';

// Material UI
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    bottomMargin: {
        marginBottom: '10px',
    }
}));

// Page component
function NotificationMethodsDialog({
    classes,
    token,
    updateAlertDetails,
    updateAlertOpen,
    notificationMethods,
    dialogNotificationMethodsOpen,
    updateDialogNotificationMethodsOpen
}) {
    const notificationMethodsDialogClasses = useStyles();

    // Notification methods states
    const [notificationMethodsLoading, updateNotificationMethodsLoading] = useState(false);
    const [phoneNotification1, updatePhoneNotification1] = useState('');
    const [phoneNotification2, updatePhoneNotification2] = useState('');
    const [emailNotification1, updateEmailNotification1] = useState('');
    const [emailNotification2, updateEmailNotification2] = useState('');
    
    // Error states
    const [validatePhoneNotification1, updateValidatePhoneNotification1] = useState({ hasError: false, errorMessage: '' });
    const [validatePhoneNotification2, updateValidatePhoneNotification2] = useState({ hasError: false, errorMessage: '' });
    const [validateEmailNotification1, updateValidateEmailNotification1] = useState({ hasError: false, errorMessage: '' });
    const [validateEmailNotification2, updateValidateEmailNotification2] = useState({ hasError: false, errorMessage: '' });
    const [notificationMethodsSubmitError, updateNotificationMethodsSubmitError] = useState({ hasError: false, errorMessage: '' });

    // Handle dialog close
    const handleDialogNotificationMethodsClose = () => {
        updateDialogNotificationMethodsOpen(false);
        updateNotificationMethodsSubmitError({ hasError: false, errorMessage: '' });
    };

    // Strips the formatting down to just the numbers
    // We don't want any +()- or spaces when we send it off to the api
    const cleanPhoneNumberValue = (phoneNumber) => phoneNumber.replace(/[^0-9]/g, '');

    const validateInputs = () => {
        let tempEmail1 = { hasError: false, errorMessage: '' };
        let tempEmail2 = { hasError: false, errorMessage: '' };
        let tempPhone1 = { hasError: false, errorMessage: '' };
        let tempPhone2 = { hasError: false, errorMessage: '' };

        // Validate email 1 input
        // This is required so we need to ensure user did input something
        if (emailNotification1.trim() === '') {
            tempEmail1 = { hasError: true, errorMessage: 'An email address is required' };
        } else if (!EmailValidator.validate(emailNotification1)) {
            tempEmail1 = { hasError: true, errorMessage: 'Invalid format for email address' };
        };

        // Validate email 2 input
        // This is not required so just check to make sure its a valid email if entered
        if (emailNotification2.trim() !== '' && !EmailValidator.validate(emailNotification2)) {
            tempEmail2 = { hasError: true, errorMessage: 'Invalid format for email address' };
        } else if (emailNotification2 && emailNotification1 === emailNotification2) {
            tempEmail2 = { hasError: true, errorMessage: 'Email cannot be the same as email 1' };
        };

        // Validate phone number 1 input
        // This is required so we need to ensure user did input something
        if (phoneNotification1.length === 0) {
            tempPhone1 = { hasError: true, errorMessage: 'A phone number is required' };
        } else if (phoneNotification1.length !== 11) {
            tempPhone1 = { hasError: true, errorMessage: 'Please enter a valid phone number' };
        };

        // Validate phone number 2 input
        if (phoneNotification2 && phoneNotification2.length !== 11) {
            tempPhone2 = { hasError: true, errorMessage: 'Please enter a valid phone number' };
        } else if (phoneNotification2 && phoneNotification1 === phoneNotification2) {
            tempPhone2 = { hasError: true, errorMessage: 'Number cannot be the same as phone 1' };
        };

        // Update validation states
        updateValidateEmailNotification1(tempEmail1);
        updateValidateEmailNotification2(tempEmail2);
        updateValidatePhoneNotification1(tempPhone1);
        updateValidatePhoneNotification2(tempPhone2);

        // This determines if we had an error in any of the states
        // We return this so the submit function can check if there was an error
        // If it finds one it will kill the request
        return [tempEmail1.hasError, tempEmail2.hasError, tempPhone1.hasError, tempPhone2.hasError].includes(true) ? true : false;
    };

    // Submit new notification methods from user to api
    const handleUpdateNotifications = async () => {

        // Validate inputs
        const hasValidationError = validateInputs(emailNotification1, emailNotification2, phoneNotification1, phoneNotification2);
        if (hasValidationError) return;

        // Turn on loading state
        // Disables the save button and shows the loading spinner
        updateNotificationMethodsLoading(true);
        
        // Send api request
        try {
            const joinedEmails = [emailNotification1, emailNotification2].join(',');
            const joinedPhoneNumbers = [phoneNotification1,phoneNotification2].join(',');
            const url = `referexpert/notification`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notificationEmail: joinedEmails,
                    notificationMobile: joinedPhoneNumbers
                })
            });
            
            // Failed response
            if (response.status !== 200) throw response.statusText;
            
            // Close dialog
            updateDialogNotificationMethodsOpen(false);

            // Show success alert
            updateAlertDetails({ type: 'success', message: 'Notification settings have been updated!' });
            updateAlertOpen(true);
        } catch (err) {
            console.log(err);

            // Show success alert
            updateNotificationMethodsSubmitError({ hasError: true, errorMessage: 'There was an error with our servers while saving your notification settings. Please wait a moment and try again'});
            // updateAlertDetails({ type: 'error', message: 'Failed to save notification settings' });
            // updateAlertOpen(true);
        } finally {
            updateNotificationMethodsLoading(false);
        };
    };

    // Autofill previous info if we already have it
    useEffect(() => {
        if (
            notificationMethods
            && notificationMethods.notificationEmail
            && notificationMethods.notificationMobile
        ) {
            const { notificationEmail, notificationMobile } = notificationMethods;
            
            // Input emails if already saved
            const [email1, email2] = notificationEmail.split(',');
            updateEmailNotification1(email1);
            updateEmailNotification2(email2);

            // Input mobiles
            const [phone1, phone2] = notificationMobile.split(',');
            updatePhoneNotification1(phone1);
            updatePhoneNotification2(phone2);
        };
    }, [notificationMethods]);

    return (
        <Dialog
            open={dialogNotificationMethodsOpen}
            onClose={handleDialogNotificationMethodsClose}
            aria-labelledby="notification-methods"
            aria-describedby="Update your notification methods dialog"
            maxWidth='xs'
        >
            {/* Title */}
            <DialogTitle id="alert-dialog-title">Update your notification methods</DialogTitle>
            
            {/* Description */}
            <DialogContent>
                <DialogContentText>
                    To recieve notifications on appointment confirmations and other important events please let us know where we should send them.
                </DialogContentText>
            </DialogContent>

            {/* Email inputs */}
            <DialogContent>
                <DialogContentText>Email notifications</DialogContentText>

                {/* Email input 1 */}
                <TextField
                    name='emailMethod1'
                    label='Email 1'
                    variant='outlined'
                    type='email'
                    classes={{ root: notificationMethodsDialogClasses.bottomMargin }}
                    value={emailNotification1}
                    onChange={(event) => updateEmailNotification1(event.target.value)}
                    error={validateEmailNotification1.hasError}
                    helperText={validateEmailNotification1.errorMessage ? validateEmailNotification1.errorMessage : 'required'}
                    fullWidth
                />

                {/* Email input 2 */}
                <TextField
                    name='emailMethod2'
                    label='Email 2'
                    variant='outlined'
                    type='email'
                    value={emailNotification2}
                    onChange={(event) => updateEmailNotification2(event.target.value)}
                    error={validateEmailNotification2.hasError}
                    helperText={validateEmailNotification2.errorMessage}
                    fullWidth
                />
            </DialogContent>

            {/* Phone number inputs */}
            <DialogContent>
                <DialogContentText>Text notifications</DialogContentText>

                {/* Inputs are inside this div so we can place them next to each other */}
                {/* As well as letting them go vertical on a mobile device */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    
                    {/* Phone input 1 */}
                    <MuiPhoneNumber
                        defaultCountry={'us'}
                        countryCodeEditable={false}
                        style={{ marginBottom: '10px', maxWidth: '175px' }}
                        value={phoneNotification1}
                        onChange={(value) => updatePhoneNotification1(cleanPhoneNumberValue(value))}
                        error={validatePhoneNotification1.hasError}
                        helperText={validatePhoneNotification1.errorMessage ? validatePhoneNotification1.errorMessage : 'required'}
                        required
                        disableDropdown
                    />

                    {/* Phone input 2 */}
                    <MuiPhoneNumber
                        defaultCountry={'us'}
                        disableDropdown={true}
                        countryCodeEditable={false}
                        style={{ marginBottom: '10px', maxWidth: '175px' }}
                        value={phoneNotification2}
                        onChange={(value) => updatePhoneNotification2(cleanPhoneNumberValue(value))}
                        error={validatePhoneNotification2.hasError}
                        helperText={validatePhoneNotification2.errorMessage}
                    />
                </div>
            </DialogContent>

            {/* Submit error message */}
            <div className='errorMessage'>{ notificationMethodsSubmitError.errorMessage }</div>

            {/* Action buttons */}
            <DialogActions>
                <Button onClick={handleDialogNotificationMethodsClose}>Cancel</Button>
                <Button
                    classes={{ root: classes.primaryButton }}
                    onClick={handleUpdateNotifications}
                    disabled={notificationMethodsLoading}
                >
                    { notificationMethodsLoading ? <CircularProgress size={20} color='primary' /> : 'Save' }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NotificationMethodsDialog;