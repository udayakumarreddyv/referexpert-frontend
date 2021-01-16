import { useState, useEffect } from 'react';
import './styles/Userpage.css';

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

function Userpage({ classes }) {
    const userpageClasses = useStyles();

    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Pending appointments states
    const [pendingAppointmentsData, updatePendingAppointmentsData] = useState([
        { id: 1, patient: 'Billy joel', appointmentTimestamp: '2021-01-11T18:00:00', referredBy: 'James quick', status: 'pending' },
        { id: 2, patient: 'James charles', appointmentTimestamp: '2021-01-13T22:00:00', referredBy: 'Dr. Drew', status: 'pending' },
        { id: 3, patient: 'Steven atkins', appointmentTimestamp: '2021-01-14T18:00:00', referredBy: 'Bill Gates', status: 'pending' },
        { id: 4, patient: 'Elon Musk', appointmentTimestamp: '2021-01-12T10:00:00', referredBy: 'Timmy Turner', status: 'pending' },
        { id: 5, patient: 'Steven atkins', appointmentTimestamp: '2021-01-18T08:00:00', referredBy: 'Sammy sosa', status: 'pending' },
    ]);

    // Open appointments
    const [openAppointments, updateOpenAppointments] = useState([
        { id: 1, patient: 'Billy joel', appointmentTimestamp: '2021-01-11T18:00:00', referredBy: 'James quick', status: 'pending' },
        { id: 2, patient: 'James charles', appointmentTimestamp: '2021-01-13T22:00:00', referredBy: 'Dr. Drew', status: 'pending' },
        { id: 3, patient: 'Steven atkins', appointmentTimestamp: '2021-01-14T18:00:00', referredBy: 'Bill Gates', status: 'pending' },
        { id: 4, patient: 'Elon Musk', appointmentTimestamp: '2021-01-12T10:00:00', referredBy: 'Timmy Turner', status: 'pending' },
        { id: 5, patient: 'Steven atkins', appointmentTimestamp: '2021-01-18T08:00:00', referredBy: 'Sammy sosa', status: 'pending' },
    ]);

    // Fetch pending appointments
    const fetchPendingAppointments = async () => {
        try {
            const url = '';
            const response = await fetch(url);
            const results = response.json();

            updatePendingAppointmentsData(results);
        } catch (err) {
            console.log(err);
            // TODO: Handle failed fetch call
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
            const newPendingAppointmentsData = pendingAppointmentsData.filter((appointment) => appointment.id !== appointmentId);
            updatePendingAppointmentsData(newPendingAppointmentsData);

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
                    appointmentsData={pendingAppointmentsData}
                    handlePendingAppointmentUpdate={handlePendingAppointmentUpdate}
                />
            </section>

        </section>
    );
};

export default Userpage;