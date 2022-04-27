import { useState, useEffect, useMemo } from 'react';
import { useLocation } from "react-router-dom";
import './styles/PatientTimepage.css';

// Apis
import {
    submitAvailabilityResponse,
    submitAppointment,
    submitFinalizeAvailabilityResponse,
    submitRejectAvailabilityResponse,
} from '../api/referralsApi';
import { fetchAppointmentById } from '../api/appointmentsApi';

// Material UI
import {
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

// Time
import moment from 'moment';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    rejectButton: {
        color: '#ffffff',
        backgroundColor: '#ff6961',
        '&:hover': {
            backgroundColor: '#ff5148',
        }
    },
}));

// Get query params from url
function useQuery() {
    const { search } = useLocation();  
    return useMemo(() => new URLSearchParams(search), [search]);
};

// Page component
function PatientTimepage({ classes }) {
    const patientTimePageClasses = useStyles();

    // Get the query variables that we need from the url
    const query = useQuery();
    const appointmentId = query.get('appointmentid');
    const token = query.get('token');

    // Appointment states
    const [loadingAppointmentDetails, updateLoadingAppointmentDetails] = useState(true);
    const [loadApppointmentError, updateLoadAppointmentError] = useState(false);
    const [appointmentData, updateAppointmentData] = useState(null);

    // Form states
    const [submitComplete, updateSubmitComplete] = useState(false);
    const [loadingSubmit, updateLoadingSubmit] = useState(false);
    const [selectedAppointmentDate, updateSelectedAppointmentDate] = useState(null);

    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Patient confirmed an appointment time
    const handleConfirm = async (confirmAppointmentDetails, token) => {
        try {
            const {
                appointmentId,
                appointmentFrom, appointmentTo,
                dateAndTimeString,
                subject,
                reason,
                patientName,
                patientEmail,
                patientPhone
            } = confirmAppointmentDetails;

            // User has not selected an appointment date
            if (!selectedAppointmentDate) return;

            updateLoadingSubmit(true);
            await submitAppointment({
                appointmentFrom,
                appointmentTo,
                dateAndTimeString: selectedAppointmentDate,
                subject,
                reason,
                patientName,
                patientEmail,
                patientPhone,
                token
            });
            await submitFinalizeAvailabilityResponse({ appointmentId });
            updateSubmitComplete(true);
            updateAlertDetails({ type: 'success', message: `Appointment has been requested!` });
        } catch (err) {
            console.log(err);
            updateAlertDetails({ type: 'error', message: `Sorry, the request failed. Please try again later.` });
        } finally {
            updateLoadingSubmit(false);
            updateAlertOpen(true);
        };
    };

    // Patient rejected all appointment times
    const handleReject = async (appointmentId) => {
        try {            
            updateLoadingSubmit(true);
            await submitRejectAvailabilityResponse({ appointmentId });
            updateSubmitComplete(true);
            updateAlertDetails({ type: 'success', message: `Reponse has been rejected!` });
        } catch (err) {
            updateAlertDetails({ type: 'error', message: `Sorry, the request failed. Please try again later.` });
        } finally {
            updateLoadingSubmit(false);
            updateAlertOpen(true);
        };
    };

    // Fetch the appointment details using the provided query params
    useEffect(async () => {
        try {
            const results = await fetchAppointmentById({ appointmentId });
            updateAppointmentData(results);
        } catch (err) {
            console.log(err);
            updateLoadAppointmentError(true);
        } finally {
            updateLoadingAppointmentDetails(false);
        };
    }, []);

    // Loading appointment details
    if (loadingAppointmentDetails) {
        return (
            <section id='patientTimePage-body'>
                <CircularProgress size={80} />
            </section>
        );
    };

    // Failed to load appointment data
    if (loadApppointmentError) {
        return (
            <section id='patientTimePage-body' className='errorMessage'>
                <h1>Failed to load appointment details</h1>
                <div>This may be caused by a bad link or a server error</div>
            </section>
        );
    };

    // Patient has already responded to this appointment
    if (appointmentData.isServed) {
        return (
            <section id='patientTimePage-body'>
                <h1>You have already responded to this request</h1>
            </section>
        );
    };

    // Submit complete message
    if (submitComplete) {
        return (
            <section id='patientTimePage-body'>
                <h1>Your response has been submitted!</h1>
            </section>
        );
    };

    return (
        <section id='patientTimePage-body'>

            {/* Title */}
            <h1 className='pageTitle'>Please choose your perferred appointment time</h1>
            
            {/* Doctor details */}
            <section id='patientTimePage-doctorDetailsContainer'>
                <div className='patientTimePage-doctorDetailInfo'>Dr. { `${ appointmentData.toFirstName } ${ appointmentData.toLastName }` } at { appointmentData.toDoctorOffice }</div>
                <div className='patientTimePage-doctorDetailInfo'>Appointment reason: { appointmentData.reason }</div>
            </section>

            {/* Appointment times */}
            <section id='patientTimePage-timesContainer'>
                <h2 className='pageSubTitle'>Available appointment time(s):</h2>

                <FormControl>
                    <RadioGroup
                        aria-labelledby="appointmentTimeRadioGroup"
                        name="appointmentTimeRadioGroup"
                        onChange={(event) => updateSelectedAppointmentDate(event.target.value)}
                    >
                        {
                            appointmentData.dateAndTimeString.split(',').map((time) => {
                                const formattedTime = moment(time, 'MM/DD/YY hh:mm A').format('hh:mm A MM/DD/YY');
                                return <FormControlLabel key={time} value={time} control={<Radio />} label={formattedTime} />
                            })
                        }
                    </RadioGroup>
                </FormControl>

                {/* Button container */}
                <div id='patientTimePage-buttonContainer'>

                    {/* Reject button */}
                    <Button
                        classes={{ root: patientTimePageClasses.rejectButton }}
                        onClick={() => handleReject(appointmentId)}
                        disabled={loadingSubmit}
                    >
                        { loadingSubmit ? <CircularProgress size={20} /> : 'Reject' }
                    </Button>

                    {/* Confirm button */}
                    <Button
                        classes={{ root: classes.primaryButton }}
                        onClick={() => handleConfirm(appointmentData, token)}
                        disabled={loadingSubmit || !selectedAppointmentDate}
                    >
                        { loadingSubmit ? <CircularProgress size={20} /> : 'Accept' }
                    </Button>
                </div>
            </section>

            <span id='patientTimePage-rejectText'>If none of these time(s) will work, please click the reject button</span>


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

export default PatientTimepage;