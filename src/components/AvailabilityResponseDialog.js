import './styles/AvailabilityResponseDialog.css';

// Material UI
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    // TextField,
} from '@material-ui/core';
import DateTimePicker from 'react-datetime-picker';

import { Person, Notes, AccessTime } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

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
    const availabilityResponseDialogClasses = useStyles();
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
        appointmentDate1,
        appointmentDate2,
        appointmentDate3,
        updateAppointmentDate1,
        updateAppointmentDate2,
        updateAppointmentDate3,
        handleAvailabilityResponseRequest,

        // Validate states
        validateAppointmentDate1,
        validateAppointmentDate2,
        validateAppointmentDate3,
    } = props;
    
    // This is used to prevent doctors from sending back appointment dates from today
    // Doctor must select a date of at least tomorrow onward
    const startOfTomorrow = moment().add(1, 'day').startOf('day').toDate();

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
                        <Person classes={{ root: availabilityResponseDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.fromName }
                    </div>
                    
                    {/* Subject */}
                    <div className='availabilityResponseDialog-doctorDetail'>
                        <Notes classes={{ root: availabilityResponseDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.reason }
                    </div>
                    
                    {/* Appointment time request by patient */}
                    <div className='availabilityResponseDialog-doctorDetail'>
                        <AccessTime classes={{ root: availabilityResponseDialogClasses.doctorDetailsIcon }} />
                        { doctorDetails.subject }
                    </div>
                </section>
                
                {/* Appointment details */}
                <div className='pageSubTitle'>Appointment details</div>
                <div className='availabilityResponseDialog-explanationText'>Please recommend at least one appointment time to send back</div>
                <section id='availabilityResponseDialog-appointmentDetailsContainer'>

                    {/* Appointment time option 1 */}
                    <div className='availabilityResponseDialog-timeOptionContainer'>
                        <span
                            className='availabilityResponseDialog-timeOptionLabel'
                            style={validateAppointmentDate1.hasError ? { color: 'red' } : null }
                        >Option 1</span>
                        <DateTimePicker
                            onChange={(newDateTime) => updateAppointmentDate1(newDateTime)}
                            value={appointmentDate1}
                            clearIcon={null}
                            disableClock={true}
                            minDate={startOfTomorrow}
                            required={true}
                            monthPlaceholder='MM'
                            dayPlaceholder='DD'
                            yearPlaceholder='YYYY'
                            hourPlaceholder='HH'
                            minutePlaceholder='MM'
                        />
                        <span
                            className='availabilityResponseDialog-requiredLabel'
                            style={validateAppointmentDate1.hasError ? { color: 'red' } : null }
                        >* REQUIRED</span>
                    </div>

                    {/* Appointment time option 2 */}
                    <div className='availabilityResponseDialog-timeOptionContainer'>
                        <span
                            className='availabilityResponseDialog-timeOptionLabel'
                            style={validateAppointmentDate2.hasError ? { color: 'red' } : null }
                        >Option 2</span>
                        <DateTimePicker
                            onChange={(newDateTime) => updateAppointmentDate2(newDateTime)}
                            value={appointmentDate2}
                            clearIcon={null}
                            disableClock={true}
                            minDate={startOfTomorrow}
                            monthPlaceholder='MM'
                            dayPlaceholder='DD'
                            yearPlaceholder='YYYY'
                            hourPlaceholder='HH'
                            minutePlaceholder='MM'
                        />
                        <div className='errorMessage'>{ validateAppointmentDate2.errorMessage }</div>
                    </div>

                    {/* Appointment time option 3 */}
                    <div className='availabilityResponseDialog-timeOptionContainer'>
                        <span
                            className='availabilityResponseDialog-timeOptionLabel'
                            style={validateAppointmentDate3.hasError ? { color: 'red' } : null }
                        >Option 3</span>
                        <DateTimePicker
                            onChange={(newDateTime) => updateAppointmentDate3(newDateTime)}
                            value={appointmentDate3}
                            clearIcon={null}
                            disableClock={true}
                            minDate={startOfTomorrow}
                            monthPlaceholder='MM'
                            dayPlaceholder='DD'
                            yearPlaceholder='YYYY'
                            hourPlaceholder='HH'
                            minutePlaceholder='MM'
                        />
                        <div className='errorMessage'>{ validateAppointmentDate3.errorMessage }</div>
                    </div>
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