import { useState, useEffect, useContext } from 'react';
import './styles/Referralspage.css';

// Time parsing
import * as moment from 'moment';

// Global store
import { Context } from '../store/GlobalStore';

// Components
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

// Page component
function Referralspage({ classes }) {
    const referralspageClasses = useStyles();
    const [state, dispatch] = useContext(Context);
    const [loading, updateLoading] = useState(false);
    
    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Dialog states
    const [dialogInviteDoctorOpen, updateDialogInviteDoctorOpen] = useState(false);

    // Referrals states
    const [referralsData, updateReferralsData] = useState(null);

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

    // Launch fetch appointments, referrals, and notifications on load
    useEffect(() => {
        fetchReferrals();
    }, []);

    return (
        <section id='referralspage-body'>

            {/* Top bar for holding buttons */}
            <section id='referralspage-topBar'>

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

            {/* Referrals */}
            <h1 className='pageTitle hasIcon'>
                <Share classes={{ root: referralspageClasses.titleIcon }} />
                My referrals
            </h1>
            <section id='referralspage-referralsContainer'>
                <Referrals
                    classes={classes}
                    referralsData={referralsData}
                />
            </section>


            {/* Invite doctor dialog component */}
            <InviteDoctorDialog
                classes={classes}
                
                userEmail={state.userEmail}
                dialogInviteDoctorOpen={dialogInviteDoctorOpen}
                updateDialogInviteDoctorOpen={updateDialogInviteDoctorOpen}
                updateAlertDetails={updateAlertDetails}
                updateAlertOpen={updateAlertOpen}
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