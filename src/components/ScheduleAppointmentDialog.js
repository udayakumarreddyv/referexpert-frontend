import './styles/ScheduleAppointmentDialog.css';

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
        doctorName,
        doctorType,
        doctorCity,
        doctorZipCode,

        // Input states
        updatePatientName,
        updateReason,
        handleScheduleAppointment,

        // Validation states
        validatePatientName,
        validateReason,
        validateAppointmentDate
    } = props;

    return (
        <Dialog
            open={showScheduleView}
            onClose={handleCloseScheduleDialog}
        >
            <DialogTitle>Schedule an appointment</DialogTitle>
            <DialogContent>
                
                {/* Doctor information */}
                <div className='pageSubTitle'>Doctor details</div>
                <section id='referpatientpage-doctorDetailsContainer'>
                    {/* Doctor name */}
                    <div className='scheduleAppointmentDialog-doctorDetail'>
                        <Person classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorName }
                    </div>
                    
                    {/* Doctor type */}
                    <div className='scheduleAppointmentDialog-doctorDetail'>
                        <LocalHospital classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorType }
                    </div>
                    
                    {/* Doctor location */}
                    <div className='scheduleAppointmentDialog-doctorDetail'>
                        <Home classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorCity }, { doctorZipCode }
                    </div>
                </section>
                
                {/* Appointment details */}
                <div className='pageSubTitle'>Appointment details</div>
                <section id='scheduleAppointmentDialog-appointmentDetailsContainer'>
                    {/* Patient name */}
                    <TextField
                        name='patientName'
                        label='Patient name'
                        variant='outlined'
                        classes={{ root: scheduleAppointmentDialogClasses.inputBottomMargin }}
                        onChange={(event) => updatePatientName(event.target.value)}
                        error={validatePatientName.hasError}
                        fullWidth
                    />

                    {/* Reason */}
                    <TextField
                        name='reason'
                        label='Reason'
                        variant='outlined'
                        classes={{ root: scheduleAppointmentDialogClasses.inputBottomMargin }}
                        onChange={(event) => updateReason(event.target.value)}
                        multiline
                        rows={3}
                        error={validateReason.hasError}
                        fullWidth
                    />

                    {/* Appointment date & time */}
                    <TextField
                        name='appointmentDateTime'
                        label='Appointment date'
                        type='datetime-local'
                        // defaultValue={}
                        error={validateAppointmentDate.hasError}
                        fullWidth
                    />
                </section>
            </DialogContent>

            <DialogActions>
                {/* Cancel button */}
                <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
                
                {/* Schedule button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    onClick={handleScheduleAppointment}
                    disabled={loadingScheduleAppointment}
                >
                    { loadingScheduleAppointment ? <CircularProgress size={20} /> : 'Schedule' }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScheduleAppointmentDialog;