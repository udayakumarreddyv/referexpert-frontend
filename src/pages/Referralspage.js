import { useState, useEffect, useContext } from 'react';
import './styles/Referralspage.css';

// Global store
import { Context } from '../store/GlobalStore';

// Components
import Referrals from '../components/Referrals';
import AvailabilityTable from '../components/AvailabilityTable';
import AvailabilityResponseDialog from '../components/AvailabilityResponseDialog';
import ConfirmResponseDialog from '../components/ConfirmResponseDialog';

// Apis
import { refreshPendingTasks } from '../api/pendingTasksApi';
import {
    fetchAvailabilityResponses,
    fetchPendingAvailabilityRequests,
    fetchReferrals,
    submitAvailabilityResponse,
    submitAppointment,
    submitFinalizeAvailabilityResponse,
    submitRejectAvailabilityResponse,
} from '../api/referralsApi';
import { useInterval } from '../api/polling';

// Page navigation
import { Link } from 'react-router-dom';

// Material UI
import {
    Badge,
    Button,
    Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Share } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Time
import moment from 'moment';

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

    // Table data states
    const [referralsData, updateReferralsData] = useState(null);
    const [availabilityRequests, updateAvailabilityRequests] = useState(null);
    const [availabilityResponses, updateAvailabilityResponses] = useState(null);

    // Availability response dialog states
    const [loadingAvailabilityResponse, updateLoadingAvailabilityResponse] = useState(false);
    const [showAvailabilityResponseView, updateShowAvailabilityResponseView] = useState(false);
    const [doctorDetails, updateDoctorDetails] = useState({
        appointmentId: null,
        fromName: '',
        subject: '',
        reason: '',
    });
    const [appointmentDate1, updateAppointmentDate1] = useState();
    const [appointmentDate2, updateAppointmentDate2] = useState(null);
    const [appointmentDate3, updateAppointmentDate3] = useState(null);
    const [validateAppointmentDate1, updateValidateAppointmentDate1] = useState({ hasError: false, errorMessage: '' });
    const [validateAppointmentDate2, updateValidateAppointmentDate2] = useState({ hasError: false, errorMessage: '' });
    const [validateAppointmentDate3, updateValidateAppointmentDate3] = useState({ hasError: false, errorMessage: '' });

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
    const [selectedAppointmentDate, updateSelectedAppointmentDate] = useState(null);
    const [validateSelectedAppointmentDate, updateValidateSelectedAppointmentDate] = useState({ hasError: false, errorMessage: '' });

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
        updateAppointmentDate1(null);
        updateAppointmentDate2(null);
        updateAppointmentDate3(null);

        // Clear appointment input validation states
        updateValidateAppointmentDate1({ hasError: false, errorMessage: '' });
        updateValidateAppointmentDate2({ hasError: false, errorMessage: '' });
        updateValidateAppointmentDate3({ hasError: false, errorMessage: '' });

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

    // Handle sending back a response from availability responses table
    const handleAvailabilityResponseRequest = async () => {

        // Clear any previous validation errors
        updateValidateAppointmentDate1({ hasError: false, errorMessage: '' });
        updateValidateAppointmentDate2({ hasError: false, errorMessage: '' });
        updateValidateAppointmentDate3({ hasError: false, errorMessage: '' });

        // Flag for this request to catch any validation errors and kill request if so
        let hasValidationError = false;

        // Used to compare times against each other
        // We check times to make sure doctor hasn't suggested same datetime multiple times
        const momentAppointmentDate1 = moment(appointmentDate1);
        const momentAppointmentDate2 = moment(appointmentDate2);
        const momentAppointmentDate3 = moment(appointmentDate3);

        // Validate that appointment date 1 was selected
        if (!appointmentDate1) {
            updateValidateAppointmentDate1({ hasError: true, errorMessage: '' });
            hasValidationError = true;
        } else if (!moment(appointmentDate1).isValid()) {
            updateValidateAppointmentDate1({ hasError: true, errorMessage: 'Invalid date for appointment date 1' });
            hasValidationError = true;
        };

        // Validate that appointment date 2 isn't the same time as any other appointment date
        if (
            appointmentDate2
            && (momentAppointmentDate2.isSame(momentAppointmentDate1) || momentAppointmentDate2.isSame(momentAppointmentDate3))
        ) {
            updateValidateAppointmentDate2({ hasError: true, errorMessage: 'Appointment date cannot be same as others' });
            hasValidationError = true;
        };

        // Validate that appointment date 3 isn't the same time as any other appointment date
        if (
            appointmentDate3
            && (momentAppointmentDate3.isSame(momentAppointmentDate1) || momentAppointmentDate3.isSame(momentAppointmentDate2))
        ) {
            updateValidateAppointmentDate3({ hasError: true, errorMessage: 'Appointment date cannot be same as others' });
            hasValidationError = true;
        };

        // Kill request if there were any validation errors
        if (hasValidationError) return;

        try {
            // Show loading spinner in schedule dialog popup
            updateLoadingAvailabilityResponse(true);

            // Format the suggested appointment times to look user friendly
            // Remove any appointment dates that are null
            const allAppointmentDates = [appointmentDate1, appointmentDate2, appointmentDate3];
            let joinedDateTimeString = allAppointmentDates.filter((date) => date).map((date) => moment(date).format('MM/DD/YY hh:mm A'));
            joinedDateTimeString = joinedDateTimeString.join(',');

            // Send request to api
            const results = await submitAvailabilityResponse({
                appointmentId: doctorDetails.appointmentId,
                dateAndTimeString: joinedDateTimeString,
                token: state.token
            });

            // // Caught an unexpected response
            if (!('message' in results)) throw results;

            // Appoinment has been booked
            const successResponseText = 'Appointment Response Updated Successful';
            if (results.message === successResponseText) {

                // Show success alert
                // Hide dialog popup
                // Refresh availability responses table to remove this completed request
                updateAlertDetails({ type: 'success', message: `Availability response has been sent!` });
                updateAlertOpen(true);
                handleCloseAvailabilityResponseDialog();
                fetchAvailabilityResponses({ userEmail: state.userEmail, token: state.token, updateState: updateAvailabilityResponses });
                refreshPendingTasks({ token: state.token, dispatch });
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

    // Handle either accept/reject a appointment request after availability response
    // responseType can be: accept or reject
    const handleConfirmResponseRequest = async (responseType) => {
        try {
            const { appointmentId, appointmentFrom, appointmentTo, dateAndTimeString, subject, reason } = confirmResponseDetails;

            // Launch the needed api requests based on the responseType
            if (responseType === 'accept') {
                
                // Clear out bad validation state
                updateValidateSelectedAppointmentDate({ hasError: false, errorMessage: '' });

                // Validate that user selected an appointment date
                if (!selectedAppointmentDate) {
                    updateValidateSelectedAppointmentDate({ hasError: true, errorMessage: 'Please select an appointment time' });
                    updateLoadingConfirmResponse(false);
                    return;
                };

                updateLoadingConfirmResponse(true);
                await submitAppointment({ appointmentFrom, appointmentTo, dateAndTimeString: selectedAppointmentDate, subject, reason, token: state.token });
                await submitFinalizeAvailabilityResponse({ appointmentId, token: state.token });
                updateAlertDetails({ type: 'success', message: `Appointment has been requested!` });
            } else if (responseType === 'reject') {
                updateLoadingConfirmResponse(true);
                await submitRejectAvailabilityResponse({ appointmentId, token: state.token });
                updateAlertDetails({ type: 'success', message: `Reponse has been rejected!` });
            } else {
                throw new Error('Invalid option for parameter "responseType" must be either: accept or reject');
            };

            // Show success alert
            // Hide dialog popup
            // Refresh availability requests table to remove this completed request
            updateAlertOpen(true);
            handleCloseConfirmResponseDialog();
            fetchPendingAvailabilityRequests({ userEmail: state.userEmail, token: state.token, updateState: updateAvailabilityRequests });
            fetchReferrals({ userEmail: state.userEmail, token: state.token, updateState: updateReferralsData });
            refreshPendingTasks({ token: state.token, dispatch });
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
    useEffect(async () => {
        try {
            const availabilityRequestsData = await fetchPendingAvailabilityRequests({ userEmail: state.userEmail, token: state.token });
            updateAvailabilityRequests(availabilityRequestsData);
        } catch (err) {
            updateAvailabilityRequests('error');
        };

        try {
            const availabilityResponsesData = await fetchAvailabilityResponses({ userEmail: state.userEmail, token: state.token });
            updateAvailabilityResponses(availabilityResponsesData);
        } catch (err) {
            updateAvailabilityResponses('error');
        };

        try {
            const referralsData = await fetchReferrals({ userEmail: state.userEmail, token: state.token });
            updateReferralsData(referralsData);
        } catch (err) {
            updateReferralsData('error');
        };
    }, []);

    // Poll api endpoints every 15 seconds
    useInterval(async () => {
        try {
            const availabilityRequestsData = await fetchPendingAvailabilityRequests({ userEmail: state.userEmail, token: state.token });
            updateAvailabilityRequests(availabilityRequestsData);
        } catch (err) {
            updateAvailabilityRequests('error');
        };

        try {
            const availabilityResponsesData = await fetchAvailabilityResponses({ userEmail: state.userEmail, token: state.token });
            updateAvailabilityResponses(availabilityResponsesData);
        } catch (err) {
            updateAvailabilityResponses('error');
        };

        try {
            const referralsData = await fetchReferrals({ userEmail: state.userEmail, token: state.token });
            updateReferralsData(referralsData);
        } catch (err) {
            updateReferralsData('error');
        };
    }, [15000]);

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
                <Badge
                    badgeContent={" "}
                    color='error'
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    invisible={ state.pendingTasks.pendingAvailabilityResponse === 'Y' ? false : true }
                >
                    <Share classes={{ root: referralspageClasses.titleIcon }} />
                    Pending availability responses
                </Badge>
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
                <Badge
                    badgeContent={" "}
                    color='error'
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    invisible={ state.pendingTasks.pendingAvailabilityRequest === 'Y' ? false : true }
                >
                    <Share classes={{ root: referralspageClasses.titleIcon }} />
                    My pending availability requests
                </Badge>
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
                appointmentDate1={appointmentDate1}
                appointmentDate2={appointmentDate2}
                appointmentDate3={appointmentDate3}
                updateAppointmentDate1={updateAppointmentDate1}
                updateAppointmentDate2={updateAppointmentDate2}
                updateAppointmentDate3={updateAppointmentDate3}
                handleAvailabilityResponseRequest={handleAvailabilityResponseRequest}
            
                // Validation
                validateAppointmentDate1={validateAppointmentDate1}
                validateAppointmentDate2={validateAppointmentDate2}
                validateAppointmentDate3={validateAppointmentDate3}
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
                updateSelectedAppointmentDate={updateSelectedAppointmentDate}
                handleConfirmResponseRequest={handleConfirmResponseRequest}

                // Validation states
                validateSelectedAppointmentDate={validateSelectedAppointmentDate}
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