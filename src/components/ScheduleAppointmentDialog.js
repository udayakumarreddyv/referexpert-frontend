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
        updateReason,
        updateAppointmentTimestamp,
        handleScheduleAppointment,

        // Validation states
        validateSubjectLine,
        validateReason,
        validateAppointmentTimestamp
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
                    {/* Patient name */}
                    <TextField
                        name='subject'
                        label='Subject'
                        variant='outlined'
                        classes={{ root: scheduleAppointmentDialogClasses.inputBottomMargin }}
                        onChange={(event) => updateSubjectLine(event.target.value)}
                        error={validateSubjectLine.hasError}
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
                    {/* <TextField
                        name='appointmentDateTime'
                        label='Appointment date'
                        type='datetime-local'
                        // defaultValue={}
                        onChange={(event) => updateAppointmentTimestamp(event.target.value)}
                        error={validateAppointmentTimestamp.hasError}
                        helperText={validateAppointmentTimestamp.errorMessage}
                        fullWidth
                    /> */}

                    {/* Datetime picker */}
                    <div>Appointment time</div>
                    <Flatpickr
                        data-enable-time
                        placeholder='Select a date...'
                        onChange={(date, dateString) => updateAppointmentTimestamp(dateString)}
                        options={{
                            altInput: true,
                            altFormat: 'M J, Y h:iK',
                            minDate: moment().add(1, 'hour').startOf('hour').toISOString(),
                            minuteIncrement: '15',
                            defaultMinute: 0,
                            mode: 'single',
                        }}
                        className='scheduleAppointmentDialog-datetimePicker'
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