import { useState, useContext } from 'react';
import './styles/ReferPatientpage.css';

// Global store
import { Context } from '../store/GlobalStore';

// Utils
import createBasicAuth from '../utils/basicAuth';

// Time parsing
import * as moment from 'moment';

// Components
import DoctorsTable from "../components/DoctorsTable";
import ScheduleAppointmentDialog from '../components/ScheduleAppointmentDialog';

// Material UI
import {
    Button,
    FormControl,
    InputLabel,
    TextField,
    Select,
    MenuItem,
    Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    scheduleButton: {
        fontSize: '12px',
    },
    searchIcon: {
        fontSize: '30px',
    },
    searchInput: {
        width: '250px',
        [theme.breakpoints.down(400)]: {
            width: '75%',
            marginBottom: '10px',
        },
    },
    inputMarginRight: {
        marginRight: '10px',
    },
    zipcodeInput: {
        width: '80px',
    },
}));

function ReferPatientpage({ classes }) {
    const referpatientpageClasses = useStyles();
    const [state, dispatch] = useContext(Context);

    // Alert states
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Search states
    const [searchType, updateSearchType] = useState('firstName');
    const [searchValue, updateSearchValue] = useState('');
    // const [searchZipCode, updateSearchZipCode] = useState('');
    const [searchValueError, updateSearchValueError] = useState({ hasError: false, errorMessage: '' });
    // const [searchZipCodeError, updateSearchZipCodeError] = useState({ hasError: false, errorMessage: '' });

    // Loading states
    const [loadingDoctorsData, updateLoadingDoctorsData] = useState(false);
    const [loadingScheduleAppointment, updateLoadingScheduleAppointment] = useState(false);

    // Doctor table states
    const [doctorsData, updateDoctorsData] = useState(null);

    // Schedule appointment states
    // Doctor details
    const [doctorDetails, updateDoctorDetails] = useState({
        id: null,
        email: '',
        name: '',
        type: '',
        specialty: '',
        address: ''
    });
    
    // Input states
    const [patientName, updatePatientName] = useState('');
    const [reason, updateReason] = useState('');
    const [appointmentTimestamp, updateAppointmentTimestamp] = useState(null);
    
    // Validate states
    const [validatePatientName, updateValidatePatientName] = useState({ hasError: false, errorMessage: '' });
    const [validateReason, updateValidateReason] = useState({ hasError: false, errorMessage: '' });
    const [validateAppointmentTimestamp, updateValidateAppointmentTimestamp] = useState({ hasError: false, errorMessage: '' });

    // View states
    const [showScheduleView, updateShowScheduleView] = useState(false);

    // Fetch search results from api
    const searchQueryApi = async (searchType, searchQuery) => {
        try {
            searchType = searchType.toLowerCase();
            const url = `referexpert/users/${searchType}/${searchQuery}`;
            const response = await fetch(url, { headers: { 'Authorization': createBasicAuth() }});
            return await response.json();
        } catch (err) {
            throw err;
        };
    };

    // Submit appointment to api
    const submitAppointmentApi = async (appointmentFrom, appointmentTo, dateAndTimeString) => {        
        try {
            const url = 'referexpert/requestappointment';
            const body = { appointmentFrom, appointmentTo, dateAndTimeString };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': createBasicAuth(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            return await response.json();
        } catch (err) {
            throw err;
        };
    };

    // Fetch doctors data on search
    const handleDoctorSearch = async () => {
        let searchError = false;

        // Validate search value input
        if (searchValue.trim() === '') {
            updateSearchValueError({ hasError: true, errorMessage: '' });
            searchError = true;
        } else {
            updateSearchValueError({ hasError: false, errorMessage: '' });
        };
        
        // Validate search zip code input
        // if (searchZipCode.trim() === '') {
        //     updateSearchZipCodeError({ hasError: true, errorMessage: '' });
        //     searchError = true;
        // } else if (isNaN(searchZipCode) || searchZipCode.length !== 5) {
        //     updateSearchZipCodeError({ hasError: true, errorMessage: 'Invalid zip code' });
        //     searchError = true;
        // } else {
        //     updateSearchZipCodeError({ hasError: false, errorMessage: '' });
        // };

        // Kill request if search input error
        if (searchError) return;

        try {
            // Show loading spinner inside doctors table
            updateLoadingDoctorsData(true);

            // Send request to api
            const results = await searchQueryApi(searchType, searchValue);
            
            // Filter out admin accounts
            const filteredResults = results.filter((user) => user.userType !== 'ADMIN');

            // Update doctors data state and hide loading spinner
            updateDoctorsData(filteredResults);
            updateLoadingDoctorsData(false);
        } catch (err) {
            updateDoctorsData('error');
            updateLoadingDoctorsData(false);
            console.log(err);
        };
    };

    // Handle scheduling a new appointment
    const handleScheduleAppointment = async () => {

        // Clear any previous validation errors
        updateValidatePatientName({ hasError: false, errorMessage: '' });
        updateValidateReason({ hasError: false, errorMessage: '' });
        updateValidateAppointmentTimestamp({ hasError: false, errorMessage: '' });
        let validateError = false;

        // Validate patient name input
        if (patientName.trim() === '') {
            updateValidatePatientName({ hasError: true, errorMessage: '' });
            validateError = true;
        };
        
        // Validate reason input
        if (reason.trim() === '') {
            updateValidateReason({ hasError: true, errorMessage: '' });
            validateError = true;
        };

        // Validate appointment timestamp
        if (!appointmentTimestamp) {
            updateValidateAppointmentTimestamp({ hasError: true, errorMessage: '' });
            validateError = true;
        } else if (!moment(appointmentTimestamp).isValid()) {
            updateValidateAppointmentTimestamp({ hasError: true, errorMessage: 'Invalid timestamp' });
            validateError = true;
        };

        // Kill request if validation error
        if (validateError) return;

        try {
            // Show loading spinner in schedule dialog popup
            updateLoadingScheduleAppointment(true);

            // Send request to api
            const results = await submitAppointmentApi(state.userEmail, doctorDetails.email, appointmentTimestamp);

            // Caught an unexpected response
            if (!('message' in results)) {
                throw results;
            };

            // Appoinment has been booked
            if (results.message === 'Appointment Request Successful') {

                // Show success alert, hide dialog popup
                updateAlertDetails({ type: 'info', message: `Appointment has been requested!` });
                updateAlertOpen(true);
                handleCloseScheduleDialog();
            } else {

                // Unhandled error message
                throw results;
            };

            // Hide loading spinner in schedule dialog popup
            updateLoadingScheduleAppointment(false);
        } catch (err) {

            // Show failure alert
            updateAlertDetails({ type: 'error', message: `Sorry, the request failed. Please try again later.` });
            updateAlertOpen(true);

            // Hide loading spinner in schedule dialog popup
            updateLoadingScheduleAppointment(false);
            console.log(err);
        };
    };

    // Handle opening of scheduling dialog
    const handleOpenScheduleDialog = (id, email, name, type, specialty, address) => {
        
        // Update doctor states, open dialog
        updateDoctorDetails({ id, email, name, type, specialty, address });
        updateShowScheduleView(true);
    };

    // Handle closing of scheduling dialog
    const handleCloseScheduleDialog = () => {
        // Clear doctor states
        updateDoctorDetails({
            id: null,
            email: '',
            name: '',
            type: '',
            specialty: '',
            address: ''
        });
        
        // Clear appointment input states
        updatePatientName('');
        updateReason('');
        updateAppointmentTimestamp(null);

        // Clear appointment input validation states
        updateValidatePatientName({ hasError: false, errorMessage: '' });
        updateValidateReason({ hasError: false, errorMessage: '' });
        updateValidateAppointmentTimestamp({ hasError: false, errorMessage: '' });
        
        // Hide dialog
        updateShowScheduleView(false);
    };
    
    return (
        <section id='referpatientpage-body'>
            <h1 className='pageTitle'>Refer a patient</h1>

            {/* Search items */}
            <section id='referpatientpage-searchContainer'>
                
                {/* Search types */}
                <FormControl variant='outlined' classes={{ root: referpatientpageClasses.inputMarginRight }}>
                    <InputLabel>Search by</InputLabel>
                    <Select
                        name='Type'
                        label='Search by'
                        value={searchType}
                        onChange={(event) => updateSearchType(event.target.value)}
                    >
                        <MenuItem value='firstName'>First name</MenuItem>
                        <MenuItem value='lastName'>Last name</MenuItem>
                        <MenuItem value='type'>Type</MenuItem>
                    </Select>
                </FormControl>

                {/* Search input */}
                <TextField
                    name='search'
                    label='Search'
                    variant='outlined'
                    classes={{ root: `${ referpatientpageClasses.searchInput } ${ referpatientpageClasses.inputMarginRight }` }}
                    onChange={(event) => updateSearchValue(event.target.value)}
                    error={searchValueError.hasError}
                />

                {/* Location */}
                {/* <TextField
                    name='zipcode'
                    label='Zipcode'
                    variant='outlined'
                    classes={{ root: `${ referpatientpageClasses.searchInput } ${ referpatientpageClasses.zipcodeInput } ${ referpatientpageClasses.inputMarginRight }` }}
                    onChange={(event) => updateSearchZipCode(event.target.value)}
                    error={searchZipCodeError.hasError}
                    helperText={searchZipCodeError.errorMessage}

                /> */}

                {/* Button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    onClick={handleDoctorSearch}
                    style={{ height: '56px' }}
                >
                    Search
                </Button>
            </section>

            {/* Table for doctor results */}
            <section id='referpatientpage-doctorTable'>
                <DoctorsTable
                    // Styles
                    classes={classes}
                    referpatientpageClasses={referpatientpageClasses}
                    
                    // Data states
                    doctorsData={doctorsData}
                    loading={loadingDoctorsData}

                    // Dialog states
                    handleOpenScheduleDialog={handleOpenScheduleDialog}
                />
            </section>

            {/* Dialog popup for scheduling an appointment */}
            <ScheduleAppointmentDialog
                // Styles
                classes={classes}
                referpatientpageClasses={referpatientpageClasses}

                // Loading state
                loadingScheduleAppointment={loadingScheduleAppointment}

                // View states
                showScheduleView={showScheduleView}
                handleCloseScheduleDialog={handleCloseScheduleDialog}

                // Doctor info
                doctorDetails={doctorDetails}

                // Input states
                updatePatientName={updatePatientName}
                updateReason={updateReason}
                updateAppointmentTimestamp={updateAppointmentTimestamp}
                handleScheduleAppointment={handleScheduleAppointment}

                // Validation states
                validatePatientName={validatePatientName}
                validateReason={validateReason}
                validateAppointmentTimestamp={validateAppointmentTimestamp}
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

export default ReferPatientpage;