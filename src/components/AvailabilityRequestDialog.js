import './styles/AvailabilityRequestDialog.css';

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
function AvailabilityRequestDialog(props) {
    const availabilityRequestDialogClasses = useStyles();
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
        updatePatientName,
        updatePatientEmail,
        updatePatientPhone,
        updateSubjectLine,
        updateRequestedAppointmentTimes,
        handleScheduleAppointment,

        // Validation states
        validatePatientName,
        validatePatientEmail,
        validatePatientPhone,
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
                    
                    {/* Office name */}
                    <div className='availabilityRequestDialog-doctorDetail'>
                        <Person classes={{ root: availabilityRequestDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.officeName }
                    </div>
                    
                    {/* Doctor name */}
                    <div className='availabilityRequestDialog-doctorDetail'>
                        <Person classes={{ root: availabilityRequestDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.name }
                    </div>
                    
                    {/* Doctor type */}
                    <div className='availabilityRequestDialog-doctorDetail'>
                        <LocalHospital classes={{ root: availabilityRequestDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.type } { doctorDetails.specialty }
                    </div>
                    
                    {/* Doctor location */}
                    <div className='availabilityRequestDialog-doctorDetail'>
                        <Home classes={{ root: availabilityRequestDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.address }
                    </div>
                </section>

                {/* Patient details */}
                <div className='pageSubTitle'>Patient details</div>
                <section id='availabilityRequestDialog-appointmentDetailsContainer'>

                    {/* Name */}
                    <TextField
                        name='patientName'
                        label='Name'
                        variant='outlined'
                        classes={{ root: availabilityRequestDialogClasses.inputBottomMargin }}
                        onChange={(event) => updatePatientName(event.target.value)}
                        error={validatePatientName.hasError}
                        fullWidth
                    />

                    {/* Contact section */}
                    {/* <section> is used for display: flex */}
                    <section
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        {/* Email */}
                        <TextField
                            name='patientEmail'
                            label='Contact Email'
                            variant='outlined'
                            classes={{ root: availabilityRequestDialogClasses.inputBottomMargin }}
                            onChange={(event) => updatePatientEmail(event.target.value)}
                            error={validatePatientEmail.hasError}
                            helperText={validatePatientEmail.errorMessage}
                        />

                        {/* Phone */}
                        <TextField
                            name='patientPhone'
                            label='Phone number'
                            variant='outlined'
                            classes={{ root: availabilityRequestDialogClasses.inputBottomMargin }}
                            onChange={(event) => updatePatientPhone(event.target.value)}
                            error={validatePatientPhone.hasError}
                            helperText={validatePatientPhone.errorMessage}
                        />
                    </section>

                </section>
                
                {/* Appointment details */}
                <div className='pageSubTitle'>Appointment details</div>
                <section id='availabilityRequestDialog-appointmentDetailsContainer'>

                    {/* Reason */}
                    <TextField
                        name='reason'
                        label='Reason'
                        variant='outlined'
                        classes={{ root: availabilityRequestDialogClasses.inputBottomMargin }}
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
                        classes={{ root: availabilityRequestDialogClasses.inputBottomMargin }}
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

export default AvailabilityRequestDialog;