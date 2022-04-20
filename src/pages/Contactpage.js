import { Fragment, useState, useContext, useEffect } from 'react';
import './styles/Contactpage.css';

// Global store
import { Context } from '../store/GlobalStore';

// Material UI
import {
    Button,
    CircularProgress,
    Snackbar,
    TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
}));

function Contactpage({ classes }) {
    const contactpageClasses = useStyles();
    const [state, dispatch] = useContext(Context);
    const [loading, updateLoading] = useState(false);

    // Form states
    const [subject, updateSubject] = useState('');
    const [message, updateMessage] = useState('');

    // Validate form states
    const [validateSubject, updateValidateSubject] = useState({ hasError: false, errorMessage: '' });
    const [validateMessage, updateValidateMessage] = useState({ hasError: false, errorMessage: '' });

    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Validate the form fields
    const validateFields = () => {
        
        // Clear previous validation
        updateValidateSubject({ hasError: false, errorMessage: '' });
        updateValidateMessage({ hasError: false, errorMessage: '' });
        
        let hasError = false;
        if (subject.trim() === '') {
            updateValidateSubject({ hasError: true, errorMessage: '' });
            hasError = true;
        };

        if (message.trim() === '') {
            updateValidateMessage({ hasError: true, errorMessage: '' });
            hasError = true;
        };

        return hasError;
    };

    // Submit the contact form
    const submitMessage = async () => {
        
        // Validate the form fields and kill request if so
        const hasError = validateFields();
        if (hasError) return;

        // Show loading spinner
        updateLoading(true);

        try {
            const url = '/referexpert/contactsupport';
            const postBody = { subject, body: message };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postBody)
            });
            const results = await response.json();
            if ('message' in results && results.message === 'Message sent to support team') {
                console.log('Message was sent successfully');
                updateAlertDetails({ type: 'success', message: 'You message was sent! Support will reach out to you shortly' });
                clearForm();
            } else {
                updateAlertDetails({ type: 'error', message: 'Failed to send message' });
            };    
        } catch (error) {
            console.error(error);
        } finally {
            // Show alert message, disable loading spinner
            updateAlertOpen(true);
            updateLoading(false);
        };
    };

    const clearForm = () => {
        updateSubject('');
        updateMessage('');
        updateValidateSubject({ hasError: false, errorMessage: '' });
        updateValidateMessage({ hasError: false, errorMessage: '' });
    };

    // Default page view
    return (
        <section id='contactpage-body'>

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

            <section id='contactpage-contactSection'>
                <h2>Contact us</h2>
                <div>If you have any questions, concerns, or feature requests please fill out the form below.</div>

                <section id='contactpage-contactForm'>
                    
                    {/* Name */}
                    <TextField
                        name='subject'
                        label='Subject'
                        variant='outlined'
                        value={subject}
                        onChange={(event) => updateSubject(event.target.value)}
                        style={{ marginRight: '10px', marginBottom: '10px' }}
                        error={validateSubject.hasError}
                        helperText={validateSubject.errorMessage}
                        fullWidth
                    />

                    {/* Message */}
                    <TextField
                        name='message'
                        label='Message'
                        variant='outlined'
                        value={message}
                        onChange={(event) => updateMessage(event.target.value)}
                        style={{ marginRight: '10px', marginBottom: '15px' }}
                        error={validateMessage.hasError}
                        helperText={validateMessage.errorMessage}
                        multiline
                        fullWidth
                        rows={5}
                    />

                    {/* Submit button */}
                    <Button
                        classes={{ root: `${classes.primaryButton}` }}
                        onClick={submitMessage}
                        disabled={loading}
                    >
                        { loading ? <CircularProgress size={25} color='white' /> : 'Send' }
                    </Button>
                </section>
            </section>
        </section>
    );
};

export default Contactpage;