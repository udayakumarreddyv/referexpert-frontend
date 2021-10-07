import { useState, useEffect, useContext } from 'react';
import './styles/Referralspage.css';

// Global store
import { Context } from '../store/GlobalStore';

// Components
import Referrals from '../components/Referrals';
import AvailabilityTable from '../components/AvailabilityTable';
import AvailabilityResponseDialog from '../components/AvailabilityResponseDialog';
import ConfirmResponseDialog from '../components/ConfirmResponseDialog';

// Page navigation
import { Link } from 'react-router-dom';

// Material UI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Schedule, Today, CheckCircle, Share } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    titleIcon: {
        marginRight: '5px',
    },
    rejectButton: {
        color: '#ffffff',
        backgroundColor: '#ff6961',
        '&:hover': {
            backgroundColor: '#ff5148',
        }
    },
}));

// Page component
function Referralspage({ classes }) {
    const referralspageClasses = useStyles();
    const [state, dispatch] = useContext(Context);
    
    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Availability response dialog states
    const [loadingAvailabilityResponse, updateLoadingAvailabilityResponse] = useState(false);
    const [showAvailabilityResponseView, updateShowAvailabilityResponseView] = useState(false);
    const [doctorDetails, updateDoctorDetails] = useState({
        appointmentId: null,
        fromName: '',
        subject: '',
        reason: '',
    });
    const [availabilityTimeResponse, updateAvailabilityTimeResponse] = useState('');

    // Confirm Response dialog states
    const [loadingConfirmResponse, updateLoadingConfirmResponse] = useState(false);
    const [showConfirmResponseView, updateShowConfirmResponseView] = useState(false);
    const [confirmResponseDetails, updateConfirmResponseDetails] = useState({
        appointmentId: null,
        appointmentFrom: '',
        appointmentTo: '',
        toName: '',
        subject: '',
        reason: '',
        dateAndTimeString: ''
    });

    // Referrals states
    const [referralsData, updateReferralsData] = useState(null);

    // Appointment states
    const [availabilityRequests, updateAvailabilityRequests] = useState(null);
    const [availabilityResponses, updateAvailabilityResponses] = useState(null);

    // Validation states
    const [validateAvailabilityTimeResponse, updateValidateAvailabilityTimeResponse] = useState({ hasError: false, errorMessage: '' });

    // Handle opening of availability response dialog
    const handleOpenAvailabilityResponseDialog = (appointmentId, fromName, subject, reason) => {
        updateDoctorDetails({ appointmentId, fromName, subject, reason });
        updateShowAvailabilityResponseView(true);
    };

     // Handle closing of availability response dialog
     const handleCloseAvailabilityResponseDialog = () => {
        
        // Clear doctor states
        updateDoctorDetails({
            appointmentId: null,
            fromName: '',
            subject: '',
            reason: '',
        });
        
        // Clear appointment input states
        updateAvailabilityTimeResponse('');

        // Clear appointment input validation states
        updateValidateAvailabilityTimeResponse({ hasError: false, errorMessage: '' });
        
        // Hide dialog
        updateShowAvailabilityResponseView(false);
    };

    // Handle opening of confirm response dialog
    const handleOpenConfirmResponseDialog = (appointmentId, appointmentTo, appointmentFrom, toName, subject, reason, dateAndTimeString) => {
        updateConfirmResponseDetails({ appointmentId, appointmentTo, appointmentFrom, toName, subject, reason, dateAndTimeString });
        updateShowConfirmResponseView(true);
    };

    // Close the confirm response dialog
    const handleCloseConfirmResponseDialog = () => {
        updateConfirmResponseDetails({
            appointmentId: null,
            appointmentFrom: '',
            appointmentTo: '',
            toName: '',
            subject: '',
            reason: '',
            dateAndTimeString: ''
        });

        updateShowConfirmResponseView(false);
    };

    // Fetch open referrals
    const fetchPendingAppointmentResponses = async () => {
        try {
            // Fetch referrals from api
            const url = `referexpert/myavailabilityresponses/${state.userEmail}`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` }});
            const results = await response.json();
            
            // Filter out results that have already been responded to
            // This prevents the user from responding to the same request twice
            const filteredResults = results.filter((item) => item.isAccepted !== 'Y');
            
            // Update referrals state
            updateAvailabilityResponses(filteredResults);
        } catch (err) {
            console.log(err);
        };
    };

    // Fetch pending referrals
    const fetchPendingAppointmentRequests = async () => {
        try {
            // Fetch referrals from api
            const url = `referexpert/myavailabilityrequests/${state.userEmail}`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` }});
            const results = await response.json();
            
            // Filter out any requests where user has completed the appointment request
            // This prevents the user from requesting the same appointment twice
            const filteredResults = results.filter((item) => item.isServed === '');

            // Update referrals state
            updateAvailabilityRequests(filteredResults);
        } catch (err) {
            console.log(err);
        };
    };

    // Fetch referrals user had made
    const fetchReferrals = async () => {
        try {

            // Fetch referrals from api
            const url = `referexpert/myreferrals/${state.userEmail}`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` }});
            const results = await response.json();
            
            // Update referrals state
            updateReferralsData(results);
        } catch (err) {
            updateReferralsData('error');
            console.log(err);
        };
    };

    // Make an api request to the availability response api
    const submitAvailabilityResponseApi = async (appointmentId, dateAndTimeString) => {
        try {
            const url = 'referexpert/availabilityresponse';
            const body = { appointmentId, dateAndTimeString };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            return await response.json();
        } catch (err) {
            throw err;
        };
    };

    // Handle scheduling a new appointment
    const handleAvailabilityResponseRequest = async () => {

        // Clear any previous validation errors
        updateValidateAvailabilityTimeResponse({ hasError: false, errorMessage: '' });

        // Validate subject line input
        if (availabilityTimeResponse.trim() === '') {
            updateValidateAvailabilityTimeResponse({ hasError: true, errorMessage: '' });
            return;
        };

        try {
            // Show loading spinner in schedule dialog popup
            updateLoadingAvailabilityResponse(true);

            // Send request to api
            const results = await submitAvailabilityResponseApi(doctorDetails.appointmentId, availabilityTimeResponse);

            // // Caught an unexpected response
            if (!('message' in results)) {
                throw results;
            };

            // Appoinment has been booked
            const successResponseText = 'Appointment Response Updated Successful';
            if (results.message === successResponseText) {

                // Show success alert
                // Hide dialog popup
                // Refresh availability responses table to remove this completed request
                updateAlertDetails({ type: 'success', message: `Availability response has been sent!` });
                updateAlertOpen(true);
                handleCloseAvailabilityResponseDialog();
                fetchPendingAppointmentResponses();
            } else {
                throw results;
            };

            // Hide loading spinner in schedule dialog popup
            // updateLoadingAvailabilityResponse(false);
        } catch (err) {

            // Show failure alert
            updateAlertDetails({ type: 'error', message: `Sorry, the request failed. Please try again later.` });
            updateAlertOpen(true);

            // Hide loading spinner in schedule dialog popup
            updateLoadingAvailabilityResponse(false);
            console.log(err);
        };
    };

    // Schedule appointment via api request
    const handleAppointmentApi = async (appointmentFrom, appointmentTo, dateAndTimeString, subject, reason) => {
        try {
            const url = 'referexpert/requestappointment';
            const body = { appointmentFrom, appointmentTo, dateAndTimeString, subject, reason };
            console.log(body)
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const results = await response.json();

            // Validate appointment was scheduled sucessfully
            const successResponseText = 'Appointment Request Successful';
            if (!('message' in results)) throw results;
            if (results.message !== successResponseText) throw results.message;
        } catch (err) {
            throw err;
        };
    };

    // Finalize availability response api
    const handleFinalizeAvailabilityResponseApi = async (appointmentId) => {
        try {
            const url = 'referexpert/finalizeavailability';
            const body = { appointmentId };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const results = await response.json();

            // Validate availability response was finalized sucessfully
            const successResponseText = 'Updated Successfully';
            if (!('message' in results)) throw results;
            if (results.message !== successResponseText) throw results.message;
        } catch (err) {
            throw err;
        };
    };

    // Reject availability response api
    const handleRejectAvailabilityResponseApi = async (appointmentId) => {
        try {
            const url = 'referexpert/rejectavailability';
            const body = { appointmentId };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const results = await response.json();

            // Validate availability response was rejected sucessfully
            const successResponseText = 'Updated Successfully';
            if (!('message' in results)) throw results;
            if (results.message !== successResponseText) throw results.message;
        } catch (err) {
            throw err;
        };
    };

    // Handle either accept/reject a appointment request after availability response
    // responseType can be: accept or reject
    const handleConfirmResponseRequest = async (responseType) => {
        try {
            updateLoadingConfirmResponse(true);
            
            // Launch the needed api requests based on the responseType
            if (responseType === 'accept') {
                const { appointmentId, appointmentFrom, appointmentTo, dateAndTimeString, subject, reason } = confirmResponseDetails;
                await handleAppointmentApi(appointmentFrom, appointmentTo, dateAndTimeString, subject, reason);
                await handleFinalizeAvailabilityResponseApi(appointmentId);
                updateAlertDetails({ type: 'success', message: `Appointment has been requested!` });
            } else if (responseType === 'reject') {
                await handleRejectAvailabilityResponseApi(confirmResponseDetails.appointmentId);
                updateAlertDetails({ type: 'success', message: `Reponse has been rejected!` });
            } else {
                throw new Error('Invalid option for parameter "responseType" must be either: accept or reject');
            };

            // Show success alert
            // Hide dialog popup
            // Refresh availability requests table to remove this completed request
            updateAlertOpen(true);
            handleCloseConfirmResponseDialog();
            fetchPendingAppointmentRequests();
            fetchReferrals();
            updateLoadingConfirmResponse(false);
        } catch (err) {
            // Show failure alert
            updateAlertDetails({ type: 'error', message: `Sorry, the request failed. Please try again later.` });
            updateAlertOpen(true);

            // Hide loading spinner in schedule dialog popup
            updateLoadingConfirmResponse(false);
            console.log(err);
        };
    };

    // Launch fetch appointments, referrals, and notifications on load
    useEffect(() => {
        fetchPendingAppointmentRequests(); // requests from other doctors to user
        fetchPendingAppointmentResponses(); // requests to other doctors from user
        fetchReferrals(); // completed referrals from user to other doctors
    }, []);

    return (
        <section id='referralspage-body'>

            {/* Top bar for holding buttons */}
            <section id='referralspage-topBar'>

                {/* Refer a patient button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    component={Link}
                    to='/refer'
                >
                    Refer a patient
                </Button>
            </section>

            {/* Pending Availability responses */}
            <h1 className='pageTitle hasIcon'>
                <Share classes={{ root: referralspageClasses.titleIcon }} />
                Pending availability responses
            </h1>
            <section id='referralspage-referralsContainer'>
                <AvailabilityTable
                    classes={classes}
                    availabilityType='response'
                    availabilityData={availabilityResponses}
                    handleOpenAvailabilityResponseDialog={handleOpenAvailabilityResponseDialog}
                />
            </section>

            {/* Pending Availability requests */}
            <h1 className='pageTitle hasIcon'>
                <Share classes={{ root: referralspageClasses.titleIcon }} />
                My pending availability requests
            </h1>
            <section id='referralspage-referralsContainer'>
                <AvailabilityTable
                    classes={classes}
                    availabilityType='request'
                    availabilityData={availabilityRequests}
                    handleOpenConfirmResponseDialog={handleOpenConfirmResponseDialog}
                />
            </section>

            {/* Referrals */}
            <h1 className='pageTitle hasIcon'>
                <Share classes={{ root: referralspageClasses.titleIcon }} />
                My completed referrals
            </h1>
            <section id='referralspage-referralsContainer'>
                <Referrals
                    classes={classes}
                    referralsData={referralsData}
                />
            </section>

            {/* Dialog popup for responding to an availability response */}
            <AvailabilityResponseDialog
                // Styles
                classes={classes}

                // Loading state
                loadingAvailabilityResponse={loadingAvailabilityResponse}

                // View states
                showAvailabilityResponseView={showAvailabilityResponseView}
                handleCloseAvailabilityResponseDialog={handleCloseAvailabilityResponseDialog}

                // Doctor info
                doctorDetails={doctorDetails}

                // Input states
                updateAvailabilityTimeResponse={updateAvailabilityTimeResponse}
                handleAvailabilityResponseRequest={handleAvailabilityResponseRequest}
            
                // Validation
                validateAvailabilityTimeResponse={validateAvailabilityTimeResponse}
            />

            {/* Dialog popup for accept/reject an appointment once the availability response has been sent back */}
            <ConfirmResponseDialog
                classes={classes}

                // Loading state
                loadingConfirmResponse={loadingConfirmResponse}

                // View states
                showConfirmResponseView={showConfirmResponseView}
                handleCloseConfirmResponseDialog={handleCloseConfirmResponseDialog}

                // Doctor info
                confirmResponseDetails={confirmResponseDetails}

                // Input states
                handleConfirmResponseRequest={handleConfirmResponseRequest}
            />

            {/* Alert popups, only shown when user status has been updated */}
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
        </section>
    );
};

export default Referralspage;