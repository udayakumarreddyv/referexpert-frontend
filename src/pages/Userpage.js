import { useState, useEffect, useContext } from 'react';
import './styles/Userpage.css';

// Global store
import { Context } from '../store/GlobalStore';

// Components
import PendingAppointments from '../components/PendingAppointments';
import OpenAppointments from '../components/OpenAppointments';
import CompleteAppointments from '../components/CompleteAppointments';
import InviteDoctorDialog from '../components/InviteDoctorDialog';
import NotificationMethodsDialog from '../components/NotificationMethodsDialog';

// Apis
import { refreshPendingTasks } from '../api/pendingTasksApi';
import { fetchAppointments, updatePendingAppointment, completeAppointment } from '../api/appointmentsApi';
import { fetchNotifications } from '../api/notificationsApi';
import { useInterval } from '../api/polling';

// Utils
import { separateAppointments } from '../utils/appointmentsHelpers';

// Page navigation
import { Link } from 'react-router-dom';

// Material UI
import {
    Badge,
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

    const handleFetchAppointments = async () => {
        try {

            // Fetch results from api
            const results = await fetchAppointments({ userEmail: state.userEmail, token: state.token });

            // Separate appointments
            const { pendingList, openList, completedList } = separateAppointments(results);

            // Update appointments states
            updatePendingAppointments(pendingList);
            updateOpenAppointments(openList);
            updateCompleteAppointments(completedList);
        } catch (err) {
            updatePendingAppointments('error');
            updateOpenAppointments('error');
            updateCompleteAppointments('error');
        };
    };

    // Handle the fetching of notification methods
    // This lets us know if we need to pop up a modal to prompt user for them to add some
    const handleFetchNoticationMethods = async () => {
        try {
            const { results, needToOpenModal } = await fetchNotifications({ token: state.token });
            if (needToOpenModal) {
                updateDialogNotificationMethodsOpen(true);
                return;
            };
            updateNotificationMethodsData(results);
        } catch (err) {
            console.log(err);
            updateNotificationMethodsData('error');
        };
    };

    // Handle accept/reject of pending appointment
    const handlePendingAppointmentUpdate = async (appointmentId, action) => {
        try {
            // Update appointment status via api
            // actions can be: accept or reject
            await updatePendingAppointment({ action, appointmentId, token: state.token });

            // Show success alert
            const actionText = action === 'accept' ? 'accepted' : 'rejected';
            updateAlertDetails({ type: 'success', message: `Appointment has been ${actionText}` });
            updateAlertOpen(true);

            // Close dialog
            handleDialogClose();

            // Refresh appointments list from api
            handleFetchAppointments();
            refreshPendingTasks({ token: state.token, dispatch });
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
            // Update appointment status via api
            await completeAppointment({ appointmentId, token: state.token });
    
            // Show success alert
            updateAlertDetails({ type: 'success', message: `Appointment has been marked as completed!` });
            updateAlertOpen(true);

            // Refresh appointments list from api
            handleFetchAppointments();
            refreshPendingTasks({ token: state.token, dispatch });

            // Close confirmation dialog
            handleDialogClose();
        } catch (err) {
            // Show failed alert
            updateAlertDetails({ type: 'error', message: 'Failed to complete appointment' });
            updateAlertOpen(true);

            console.log(err);
        };
    };

    // Launch fetch appointments, referrals, and notifications on load
    useEffect(() => {
        handleFetchAppointments();
        handleFetchNoticationMethods();
    }, []);

    // Poll api endpoints every 15 seconds
    useInterval(async () => {
        handleFetchAppointments();
    }, [15000]);

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
                <Badge
                    badgeContent={" "}
                    color='error'
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    invisible={ state.pendingTasks.currentAppointment === 'Y' ? false : true }
                >
                    <Today classes={{ root: userpageClasses.titleIcon }} />
                    Current appointments
                </Badge>
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
                <Badge
                    badgeContent={" "}
                    color='error'
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    invisible={ state.pendingTasks.pendingAppointment === 'Y' ? false : true }
                >
                    <Schedule classes={{ root: userpageClasses.titleIcon }} />
                    Pending appointments
                </Badge>
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