import { useState, useEffect, useContext } from 'react';
import './styles/Userpage.css';

// Global store
import { Context } from '../store/GlobalStore';

// Components
import PendingAppointments from '../components/PendingAppointments';
import OpenAppointments from '../components/OpenAppointments';

// Page navigation
import { Link } from 'react-router-dom';

// Material UI
import { Button, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Schedule, Today } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    titleIcon: {
        marginRight: '5px',
    }
}));

// Separate open, pending, and closed appointments
const separateAppointments = (appointmentsList) => {
    const pendingList = [];
    const openList = [];
    const completedList = [];

    // Loop through each appointment in list, separate into buckets
    appointmentsList.forEach((appointment) => {
        console.log(appointment);
        
        // Pending appointment, open appointment, completed appointment
        if (appointment.isAccepted === 'P') {
            pendingList.push(appointment);
        } else if (appointment.isServed === 'N') {
            openList.push(appointment);
        } else if (appointment.isServed === 'Y') {
            completedList.push(appointment);
        } else {
            console.log('Invalid appointment!');
        };
    });

    return { pendingList, openList, completedList };
};

// Page component
function Userpage({ classes }) {
    const userpageClasses = useStyles();
    const [state, dispatch] = useContext(Context);

    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Appointment states
    const [pendingAppointments, updatePendingAppointments] = useState();
    const [openAppointments, updateOpenAppointments] = useState([]);

    // Fetch all appointments for user: open, pending
    const fetchAppointments = async () => {
        try {

            // Fetch from api
            const url = `/referexpert/myappointments/${state.userEmail}`;
            const response = await fetch(url);
            const results = await response.json();

            // Separate appointments
            const { pendingList, openList, completedList } = separateAppointments(results);

            // Update appointments states
            updatePendingAppointments(pendingList);
            updateOpenAppointments(openList);
        } catch (err) {
            console.log(err);
        };
    };

    // Handle accept/reject of pending appointment
    const handlePendingAppointmentUpdate = async (appointmentId, action) => {
        // actions can be: accept or reject

        try {
            // Send api request
            // const url = '';
            // const response = await fetch(url, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ appointmentId, action })
            // });
            // const results = await response.json();

            // Remove appointment from pending list if successful
            const newPendingAppointmentsData = pendingAppointments.filter((appointment) => appointment.id !== appointmentId);
            updatePendingAppointments(newPendingAppointmentsData);

            // Show success alert
            const actionText = action === 'accept' ? 'accepted' : 'rejected';
            updateAlertDetails({ type: 'info', message: `Appointment has been ${actionText}` });
            updateAlertOpen(true);
        } catch(err) {

            // Show failed alert
            updateAlertDetails({ type: 'error', message: 'Failed to update appointment' });
            updateAlertOpen(true);

            console.log(err);
        };
    };

    // Launch fetch appointments on load
    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <section id='userpage-body'>

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

            {/* Top bar for holding buttons */}
            <section id='userpage-topBar'>
                
                {/* Refer a patient button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    component={Link}
                    to='/refer'
                >
                    Refer a patient
                </Button>
            </section>

            {/* View scheduled appointments */}
            <h1 className='pageTitle hasIcon'>
                <Today classes={{ root: userpageClasses.titleIcon }} />
                Current appointments
            </h1>
            <section id='userpage-currentAppointmentsContainer'>
                <OpenAppointments
                    classes={classes}
                    appointmentsData={openAppointments}
                />
            </section>

            {/* Pending appointments */}
            <h1 className='pageTitle hasIcon'>
                <Schedule classes={{ root: userpageClasses.titleIcon }} />
                Pending appointments
            </h1>
            <section id='userpage-pendingAppointmentsContainer'>
                <PendingAppointments
                    classes={classes}
                    appointmentsData={pendingAppointments}
                    handlePendingAppointmentUpdate={handlePendingAppointmentUpdate}
                />
            </section>

        </section>
    );
};

export default Userpage;