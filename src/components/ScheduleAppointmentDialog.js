import './styles/ScheduleAppointmentDialog.css';

// Date picker
import "flatpickr/dist/themes/dark.css";
import Flatpickr from 'react-flatpickr';
import * as moment from 'moment';

// Material UI
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@material-ui/core';
import { Person, Home, LocalHospital } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Material UI styles
const useStyles = makeStyles((theme) => ({
    inputBottomMargin: {
        marginBottom: '10px',
    },
    doctorDetailsIcon: {
        marginRight: '5px',
    }
}));

// Pop up dialog for when user wants to schedule a referral
function ScheduleAppointmentDialog(props) {
    const scheduleAppointmentDialogClasses = useStyles();
    const {
        // Styles
        classes,

        // Loading state
        loadingScheduleAppointment,

        // View states
        showScheduleView,
        handleCloseScheduleDialog,

        // Doctor info
        doctorDetails,

        // Input states
        updateSubjectLine,
        updateRequestedAppointmentTimes,
        handleScheduleAppointment,

        // Validation states
        validateSubjectLine,
        validateRequestedAppointmentTimes,
    } = props;

    return (
        <Dialog
            open={showScheduleView}
            onClose={handleCloseScheduleDialog}
        >
            <DialogTitle>Request an appointment</DialogTitle>
            <DialogContent>
                
                {/* Doctor information */}
                <div className='pageSubTitle'>Doctor details</div>
                <section id='referpatientpage-doctorDetailsContainer'>
                    {/* Doctor name */}
                    <div className='scheduleAppointmentDialog-doctorDetail'>
                        <Person classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.name }
                    </div>
                    
                    {/* Doctor type */}
                    <div className='scheduleAppointmentDialog-doctorDetail'>
                        <LocalHospital classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.type } { doctorDetails.specialty }
                    </div>
                    
                    {/* Doctor location */}
                    <div className='scheduleAppointmentDialog-doctorDetail'>
                        <Home classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.address }
                    </div>
                </section>
                
                {/* Appointment details */}
                <div className='pageSubTitle'>Appointment details</div>
                <section id='scheduleAppointmentDialog-appointmentDetailsContainer'>

                    {/* Reason */}
                    <TextField
                        name='reason'
                        label='Reason'
                        variant='outlined'
                        classes={{ root: scheduleAppointmentDialogClasses.inputBottomMargin }}
                        onChange={(event) => updateRequestedAppointmentTimes(event.target.value)}
                        multiline
                        rows={3}
                        error={validateRequestedAppointmentTimes.hasError}
                        fullWidth
                    />

                    {/* Requested time */}
                    <TextField
                        name='requestedTimes'
                        label='Patient requested appointment time(s)'
                        variant='outlined'
                        classes={{ root: scheduleAppointmentDialogClasses.inputBottomMargin }}
                        onChange={(event) => updateSubjectLine(event.target.value)}
                        error={validateSubjectLine.hasError}
                        fullWidth
                    />

                </section>
            </DialogContent>

            <DialogActions>
                {/* Cancel button */}
                <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
                
                {/* Request button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    onClick={handleScheduleAppointment}
                    disabled={loadingScheduleAppointment}
                >
                    { loadingScheduleAppointment ? <CircularProgress size={20} /> : 'Request' }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScheduleAppointmentDialog;