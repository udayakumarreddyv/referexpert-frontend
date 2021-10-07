import './styles/ConfirmResponseDialog.css';

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
    doctorDetailsIcon: {
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

// Pop up dialog for when user wants to respond to an availability request
function ConfirmResponseDialog(props) {
    const confirmResponseDialogClasses = useStyles();
    const {
        // Styles
        classes,

        // Loading state
        loadingConfirmResponse,

        // View states
        showConfirmResponseView,
        handleCloseConfirmResponseDialog,

        // Doctor info
        confirmResponseDetails,

        // Input states
        handleConfirmResponseRequest,
    } = props;

    return (
        <Dialog
            open={showConfirmResponseView}
            onClose={handleCloseConfirmResponseDialog}
        >
            <DialogTitle>Would you like to schedule the appointment for this time?</DialogTitle>
            <DialogContent>
                
                {/* Doctor information */}
                <section id='referpatientpage-doctorDetailsContainer'>
                    {/* Doctor name */}
                    <div className='confirmResponseDialog-doctorDetail'>
                        <Person classes={{ root: confirmResponseDialogClasses.doctorDetailsIcon }} />
                        { confirmResponseDetails.toName }
                    </div>
                    
                    {/* Subject */}
                    <div className='confirmResponseDialog-doctorDetail'>
                        <Notes classes={{ root: confirmResponseDialogClasses.doctorDetailsIcon }} />
                        { confirmResponseDetails.reason }
                    </div>
                    
                    {/* Appointment time request by patient */}
                    <div className='confirmResponseDialog-doctorDetail'>
                        <AccessTime classes={{ root: confirmResponseDialogClasses.doctorDetailsIcon }} />
                        { confirmResponseDetails.dateAndTimeString }
                    </div>
                </section>
            </DialogContent>

            <DialogActions>
                {/* Cancel button */}
                <Button onClick={handleCloseConfirmResponseDialog}>Cancel</Button>
                
                {/* Reject button */}
                <Button
                    classes={{ root: confirmResponseDialogClasses.rejectButton }}
                    onClick={() => handleConfirmResponseRequest('reject')}
                    disabled={loadingConfirmResponse}
                >
                    { loadingConfirmResponse ? <CircularProgress size={20} /> : 'Reject' }
                </Button>

                {/* Accept button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    onClick={() => handleConfirmResponseRequest('accept')}
                    disabled={loadingConfirmResponse}
                >
                    { loadingConfirmResponse ? <CircularProgress size={20} /> : 'Accept' }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmResponseDialog;