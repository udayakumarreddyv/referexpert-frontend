import { useState } from 'react';

// Utils
import EmailValidator from 'email-validator'; // validate emails

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

// Page component
function InviteDoctorDialog(props) {
    const {
        classes,

        // Current user email
        userEmail,

        // Dialog states
        dialogInviteDoctorOpen,
        updateDialogInviteDoctorOpen,

        // Alert states
        updateAlertDetails,
        updateAlertOpen,
    } = props;

    // Invite doctor states
    const [inviteLoading, updateInviteLoading] = useState(false);
    const [inviteDoctorEmail, updateInviteDoctorEmail] = useState('');
    const [validateInviteDoctorEmail, updateValidateInviteDoctorEmail] = useState({ hasError: false, errorMessage: '' });
    const [inviteDoctorSubmitError, updateInviteDoctorSubmitError] = useState({ hasError: false, errorMessage: '' });

    // Handle dialog close
    const handleInviteDoctorDialogClose = () => {
        updateDialogInviteDoctorOpen(false);
        updateInviteDoctorEmail('');
    };

    // Handle sending invite doctor
    const handleInviteDoctor = async (email) => {
        
        // Validate email input
        if (email.trim() === '') {
            updateValidateInviteDoctorEmail({ hasError: true, errorMessage: 'Please enter an email address' });
            return;
        } else if (!EmailValidator.validate(email)) {
            updateValidateInviteDoctorEmail({ hasError: true, errorMessage: 'Invalid format for email address' });
            return;
        };
        
        try {

            // Clear error states, show loading spinner, disable button
            updateValidateInviteDoctorEmail({ hasError: false, errorMessage: '' });
            updateInviteLoading(true);

            // Send api request
            const url = '/referexpert/referuser';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail,
                    docEmail: email,
                }),
            });
            const results = await response.json();

            // Hide loading spinner
            updateInviteLoading(false);

            // Unexpected response from api
            if (!('message' in results)) throw results;

            // Show success alert
            if (results.message === 'Referral Successful') {
                updateAlertDetails({ type: 'success', message: `Invite sent to ${email}!` });
                updateAlertOpen(true);

                // Close dialog, clear errors
                handleInviteDoctorDialogClose();
                updateInviteDoctorSubmitError({ hasError: false, errorMessage: '' });
            } else if (results.message === 'User already referred or registered') {
                updateInviteDoctorSubmitError({ hasError: true, errorMessage: 'This email address has already been referred by another user' });
            } else {
                throw results.message;
            };
        } catch (err) {
            console.log(err);
            updateInviteLoading(false);
            updateInviteDoctorSubmitError({ hasError: true, errorMessage: 'There was an error while sending the invite(s), please try again later' });
        };
    };

    return (
        <Dialog
            open={dialogInviteDoctorOpen}
            onClose={handleInviteDoctorDialogClose}
            aria-labelledby="invite-doctor"
            aria-describedby="Invite a doctor to referexpert"
        >
            {/* Title */}
            <DialogTitle id="alert-dialog-title">Send invites to doctors who may like ReferExpert</DialogTitle>
            
            {/* Description */}
            <DialogContent>
                <DialogContentText>Enter the email address of the doctor(s) and we'll notify them</DialogContentText>

                {/* Email */}
                <TextField
                    name='inviteEmail'
                    label='Email'
                    variant='outlined'
                    onChange={(event) => updateInviteDoctorEmail(event.target.value)}
                    error={validateInviteDoctorEmail.hasError}
                    helperText={validateInviteDoctorEmail.errorMessage}
                    fullWidth
                />

                <div className='errorMessage'>{ inviteDoctorSubmitError.errorMessage }</div>
            </DialogContent>

            {/* Action buttons */}
            <DialogActions>
                <Button onClick={handleInviteDoctorDialogClose}>Cancel</Button>
                <Button
                    classes={{ root: classes.primaryButton }}
                    onClick={() => handleInviteDoctor(inviteDoctorEmail)}
                    disabled={inviteLoading}
                >
                    { inviteLoading ? <CircularProgress size={20} color='primary' /> : 'Invite' }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteDoctorDialog;