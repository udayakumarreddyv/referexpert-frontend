import './styles/AvailabilityResponseDialog.css';

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
import { Person, Notes, AccessTime } from '@material-ui/icons';
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

// Pop up dialog for when user wants to respond to an availability request
function AvailabilityResponseDialog(props) {
    const scheduleAppointmentDialogClasses = useStyles();
    const {
        // Styles
        classes,

        // Loading state
        loadingAvailabilityResponse,

        // View states
        showAvailabilityResponseView,
        handleCloseAvailabilityResponseDialog,

        // Doctor info
        doctorDetails,

        // Input states
        updateAvailabilityTimeResponse,
        handleAvailabilityResponseRequest,

        // Validate states
        validateAvailabilityTimeResponse,
    } = props;

    return (
        <Dialog
            open={showAvailabilityResponseView}
            onClose={handleCloseAvailabilityResponseDialog}
        >
            <DialogTitle>Confirm availability response</DialogTitle>
            <DialogContent>
                
                {/* Doctor information */}
                <div className='pageSubTitle'>Requestor details</div>
                <section id='referpatientpage-doctorDetailsContainer'>
                    {/* Doctor name */}
                    <div className='availabilityResponseDialog-doctorDetail'>
                        <Person classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.fromName }
                    </div>
                    
                    {/* Subject */}
                    <div className='availabilityResponseDialog-doctorDetail'>
                        <Notes classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.reason }
                    </div>
                    
                    {/* Appointment time request by patient */}
                    <div className='availabilityResponseDialog-doctorDetail'>
                        <AccessTime classes={{ root: scheduleAppointmentDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.subject }
                    </div>
                </section>
                
                {/* Appointment details */}
                <div className='pageSubTitle'>Appointment details</div>
                <section id='availabilityResponseDialog-appointmentDetailsContainer'>
                    {/* Date and time string */}
                    <TextField
                        name='dateAndTimeString'
                        label='Appointment time response'
                        variant='outlined'
                        classes={{ root: scheduleAppointmentDialogClasses.inputBottomMargin }}
                        onChange={(event) => updateAvailabilityTimeResponse(event.target.value)}
                        error={validateAvailabilityTimeResponse.hasError}
                        fullWidth
                    />

                    {/* Explination text for the user */}
                    <span>Please respond to whether you can do this appointment time or please recommend one</span>
                </section>
            </DialogContent>

            <DialogActions>
                {/* Cancel button */}
                <Button onClick={handleCloseAvailabilityResponseDialog}>Cancel</Button>
                
                {/* Request button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    onClick={handleAvailabilityResponseRequest}
                    disabled={loadingAvailabilityResponse}
                >
                    { loadingAvailabilityResponse ? <CircularProgress size={20} /> : 'Respond' }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AvailabilityResponseDialog;