import { useState, useEffect, useContext } from 'react';
import './styles/Userpage.css';

// Time parsing
import * as moment from 'moment';

// Global store
import { Context } from '../store/GlobalStore';

// Components
import PendingAppointments from '../components/PendingAppointments';
import OpenAppointments from '../components/OpenAppointments';
import CompleteAppointments from '../components/CompleteAppointments';
import Referrals from '../components/Referrals';
import InviteDoctorDialog from '../components/InviteDoctorDialog';
import NotificationMethodsDialog from '../components/NotificationMethodsDialog';

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

// Sort appointments by date newest to furthest
const sortAppointments = (appointmentsList) => {
    return appointmentsList.sort((first, second) => {
        return moment(second.dateAndTimeString) - moment(first.dateAndTimeString);
    });
};

// Separate open, pending, and closed appointments
const separateAppointments = (appointmentsList) => {
    let pendingList = [];
    let openList = [];
    let completedList = [];

    // Loop through each appointment in list, separate into buckets
    appointmentsList.forEach((appointment) => {

        // Pending appointment, open appointment, completed appointment
        if (appointment.isAccepted === 'P') {
            pendingList.push(appointment);
        } else if (appointment.isAccepted === 'Y' && appointment.isServed === 'N') {
            openList.push(appointment);
        } else if (appointment.isServed === 'Y') {
            completedList.push(appointment);
        } else {
            console.log(`Rejected appointment: ${appointment.appointmentId}`);
        };
    });

    // Sort appointments by dates
    pendingList = sortAppointments(pendingList);
    openList = sortAppointments(openList);
    completedList = sortAppointments(completedList);

    return { pendingList, openList, completedList };
};

// Page component
function Userpage({ classes }) {
    const userpageClasses = useStyles();
    const [state, dispatch] = useContext(Context);
    const [loading, updateLoading] = useState(false);
    
    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Dialog states
    const [dialogInviteDoctorOpen, updateDialogInviteDoctorOpen] = useState(false);
    const [dialogCompleteOpen, updateCompleteDialogOpen] = useState(false);
    const [dialogPendingAcceptOpen, updateDialogPendingAcceptOpen] = useState(false);
    const [dialogPendingRejectOpen, updateDialogPendingRejectOpen] = useState(false);
    const [dialogAppointmentId, updateDialogAppointmentId] = useState(null);

    // Appointment states
    const [pendingAppointments, updatePendingAppointments] = useState();
    const [openAppointments, updateOpenAppointments] = useState([]);
    const [completeAppointments, updateCompleteAppointments] = useState();

    // Referrals states
    const [referralsData, updateReferralsData] = useState(null);

    // Notification states
    const [dialogNotificationMethodsOpen, updateDialogNotificationMethodsOpen] = useState(false);
    const [notificationMethodsData, updateNotificationMethodsData] = useState(null);

    // Open complete appointment dialog
    const handleCompleteDialogOpen = (appointmentId) => {
        updateDialogAppointmentId(appointmentId);
        updateCompleteDialogOpen(true);
    };

    // Open pending appointment dialog
    const handlePendingDialogOpen = (appointmentId, type) => {
        updateDialogAppointmentId(appointmentId);

        if (type === 'accept') {
            updateDialogPendingAcceptOpen(true);    
        } else if (type === 'reject') {
            updateDialogPendingRejectOpen(true);
        } else {
            throw 'Invalid option for type parameter'
        };
    };

    // Handle dialog close
    const handleDialogClose = () => {
        updateDialogAppointmentId(null);
        updateCompleteDialogOpen(false);
        updateDialogPendingAcceptOpen(false);
        updateDialogPendingRejectOpen(false);
    };

    // Fetch all appointments for user: open, pending
    const fetchAppointments = async () => {
        try {

            // Fetch from api
            const url = `/referexpert/myappointments/${state.userEmail}`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}`, }});
            const results = await response.json();

            // Separate appointments
            const { pendingList, openList, completedList } = separateAppointments(results);

            // Update appointments states
            updatePendingAppointments(pendingList);
            updateOpenAppointments(openList);
            updateCompleteAppointments(completedList);
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
            const results = sortAppointments(await response.json());
            
            // Update referrals state
            updateReferralsData(results);
        } catch (err) {
            updateReferralsData('error');
            console.log(err);
        };
    };

    // Fetch notification methods
    // This will let us know if we need to popup a modal to the user for them to add them
    const fetchNotifications = async () => {
        try {
            const url = 'referexpert/notification';
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` } });
            
            // Catch errors
            if (response.status !== 200) throw response;

            const results = await response.json();

            // User has not added there notification methods yet
            // We know this by the empty object that is passed
            const isEmptyObject = Object.keys(results).length === 0;
            if (isEmptyObject) {
                updateDialogNotificationMethodsOpen(true);
                console.log('user needs to add notification methods');
                return;
            };

            updateNotificationMethodsData(results);
        } catch (err) {
            updateNotificationMethodsData('error');
            console.log(err);
        };
    };

    // Handle accept/reject of pending appointment
    const handlePendingAppointmentUpdate = async (appointmentId, action) => {
        // actions can be: accept or reject

        try {
            // Url changes depending on accept or reject
            let url;
            if (action === 'accept') {
                url = 'referexpert/acceptappointment';
            } else if (action === 'reject') {
                url = 'referexpert/rejectappointment';
            } else {
                throw 'Invalid action';
            };

            // Send api request
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ appointmentId })
            });
            const results = await response.json();

            // Response is what we expect, throw err
            if (!('message' in results)) {
                throw results;
            };

            // Success message
            if (results.message === 'Updated Successfully') {

                // Show success alert
                const actionText = action === 'accept' ? 'accepted' : 'rejected';
                updateAlertDetails({ type: 'info', message: `Appointment has been ${actionText}` });
                updateAlertOpen(true);

                // Close dialog
                handleDialogClose();

                // Refresh appointments list from api
                fetchAppointments();
            } else if (results.message === 'Issue while updating refer expert') {
                throw 'Invalid appointmentId';
            } else {
                throw 'Unhandled response message';
            };
        } catch(err) {

            // Show failed alert
            updateAlertDetails({ type: 'error', message: 'Failed to update appointment' });
            updateAlertOpen(true);

            console.log(err);
        };
    };

    // Handle completion of current appointment
    const handleCompleteAppointmentUpdate = async (appointmentId) => {
        try {
            const url = `referexpert/finalizeappointment`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appointmentId })
            });
            const results = await response.json();
            
            // Ensure message in response. catch erros elsewise
            if (!('message' in results)) {
                throw results;
            };

            // Success message
            if (results.message === 'Updated Successfully') {
    
                // Show success alert
                updateAlertDetails({ type: 'info', message: `Appointment has been marked as completed!` });
                updateAlertOpen(true);

                // Refresh appointments list from api
                fetchAppointments();

                // Close confirmation dialog
                handleDialogClose();
            } else if (results.message === 'Issue while updating refer expert') {

                // Bad appointmentId
                throw 'Bad appointmentId';
            } else {

                // Throw unhandled errors
                throw results;
            };
        } catch (err) {
            // Show failed alert
            updateAlertDetails({ type: 'error', message: 'Failed to complete appointment' });
            updateAlertOpen(true);

            console.log(err);
        };
    };

    // Launch fetch appointments, referrals, and notifications on load
    useEffect(() => {
        fetchAppointments();
        fetchReferrals();
        fetchNotifications();
    }, []);

    return (
        <section id='userpage-body'>

            {/* Top bar for holding buttons */}
            <section id='userpage-topBar'>

                {/* Invite doctor button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    style={{ marginRight: '10px' }}
                    onClick={() => updateDialogInviteDoctorOpen(true)}
                >
                    Invite doctor
                </Button>
                
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
                    handleCompleteDialogOpen={handleCompleteDialogOpen}
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
                    handlePendingDialogOpen={handlePendingDialogOpen}
                />
            </section>

            {/* Complete appointments */}
            <h1 className='pageTitle hasIcon'>
                <CheckCircle classes={{ root: userpageClasses.titleIcon }} />
                Completed appointments
            </h1>
            <section id='userpage-completeAppointmentsContainer'>
                <CompleteAppointments
                    classes={classes}
                    appointmentsData={completeAppointments}
                />
            </section>

            {/* Referrals */}
            <h1 className='pageTitle hasIcon'>
                <Share classes={{ root: userpageClasses.titleIcon }} />
                My referrals
            </h1>
            <section id='userpage-referralsContainer'>
                <Referrals
                    classes={classes}
                    referralsData={referralsData}
                />
            </section>



            {/* DIALOG SECTION */}


            {/* Accept appointment dialog */}
            <Dialog
                open={dialogPendingAcceptOpen}
                onClose={handleDialogClose}
                aria-labelledby="appointment-confirmation"
                aria-describedby="Confirm to handle a appointment action"
            >
                {/* Title */}
                <DialogTitle id="alert-dialog-title">Are you sure your would like to accept this appointment?</DialogTitle>
                
                {/* Description */}
                <DialogContent>
                    <DialogContentText>
                        Accepting will add this appointment to you upcoming appointments list.
                    </DialogContentText>
                </DialogContent>

                {/* Action buttons */}
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        classes={{ root: classes.primaryButton }}
                        onClick={() => handlePendingAppointmentUpdate(dialogAppointmentId, 'accept')}
                    >
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject appointment dialog */}
            <Dialog
                open={dialogPendingRejectOpen}
                onClose={handleDialogClose}
                aria-labelledby="appointment-confirmation"
                aria-describedby="Confirm to handle a appointment action"
            >
                {/* Title */}
                <DialogTitle id="alert-dialog-title">Are you sure your would like to reject this appointment?</DialogTitle>
                
                {/* Description */}
                <DialogContent>
                    <DialogContentText>
                        Rejecting this appointment will remove it from your pending approvals list.
                    </DialogContentText>
                </DialogContent>

                {/* Action buttons */}
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        classes={{ root: userpageClasses.rejectButton }}
                        onClick={() => handlePendingAppointmentUpdate(dialogAppointmentId, 'reject')}
                    >
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Complete appointment dialog */}
            <Dialog
                open={dialogCompleteOpen}
                onClose={handleDialogClose}
                aria-labelledby="appointment-confirmation"
                aria-describedby="Confirm to handle a appointment action"
            >
                {/* Title */}
                <DialogTitle id="alert-dialog-title">Are you sure your would like to complete this appointment?</DialogTitle>
                
                {/* Description */}
                <DialogContent>
                    <DialogContentText>
                        Completing this appointment will remove it from your upcoming appoinments list.
                    </DialogContentText>
                </DialogContent>

                {/* Action buttons */}
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        classes={{ root: classes.primaryButton }}
                        onClick={() => handleCompleteAppointmentUpdate(dialogAppointmentId)}
                    >
                        Complete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Invite doctor dialog component */}
            <InviteDoctorDialog
                classes={classes}
                
                userEmail={state.userEmail}
                dialogInviteDoctorOpen={dialogInviteDoctorOpen}
                updateDialogInviteDoctorOpen={updateDialogInviteDoctorOpen}
                updateAlertDetails={updateAlertDetails}
                updateAlertOpen={updateAlertOpen}
            />

            {/* Add/Remove notification methods dialog */}
            <NotificationMethodsDialog
                classes={classes}
                token={state.token}
                updateAlertDetails={updateAlertDetails}
                updateAlertOpen={updateAlertOpen}
                notificationMethods={notificationMethodsData}
                dialogNotificationMethodsOpen={dialogNotificationMethodsOpen}
                updateDialogNotificationMethodsOpen={updateDialogNotificationMethodsOpen}
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

export default Userpage;