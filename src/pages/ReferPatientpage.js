import { useState, useContext, useEffect } from 'react';
import './styles/ReferPatientpage.css';

// Global store
import { Context } from '../store/GlobalStore';

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
    const [currentLocation, updateCurrentLocation] = useState({ latitude: null, longitude: null });
    const [currentLocationError, updateCurrentLocationError] = useState(null);
    const [distanceType, updateDistanceType] = useState('currentLocation');
    const [distanceAmount, updateDistanceAmount] = useState('15');
    const [searchType, updateSearchType] = useState('speciality');
    const [searchValue, updateSearchValue] = useState('');
    const [searchValueError, updateSearchValueError] = useState({ hasError: false, errorMessage: '' });

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
    const [subjectLine, updateSubjectLine] = useState('');
    const [reason, updateReason] = useState('');
    const [appointmentTimestamp, updateAppointmentTimestamp] = useState(null);
    
    // Validate states
    const [validateSubjectLine, updateValidateSubjectLine] = useState({ hasError: false, errorMessage: '' });
    const [validateReason, updateValidateReason] = useState({ hasError: false, errorMessage: '' });
    const [validateAppointmentTimestamp, updateValidateAppointmentTimestamp] = useState({ hasError: false, errorMessage: '' });

    // View states
    const [showScheduleView, updateShowScheduleView] = useState(false);

    // Fetch search results from api
    const searchQueryApi = async ({ distanceType, distanceAmount, searchType, searchQuery }) => {
        try {
            let url;
            
            // User wants to use their current location
            if (distanceType === 'currentLocation') {
                console.log('Using current lcoation');

                // Error getting coordinates
                if (currentLocationError) throw currentLocationError;    
                
                url = `referexpert/users/distance/${currentLocation.latitude}/${currentLocation.longitude}/${distanceAmount}?${searchType}=${searchQuery}`;
            } else {
                url = `referexpert/users/${distanceType}/${distanceAmount}?${searchType}=${searchQuery}`;
            };

            searchType = searchType.toLowerCase();
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` }});
            return await response.json();
        } catch (err) {
            throw err;
        };
    };

    // Geolocation success
    const geolocationSuccess = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        updateCurrentLocation({ latitude, longitude });       
    };

    // Gelocation error
    const geolocationError = () => updateCurrentLocationError('Please allow current location to use this distance by type');

    // Get current location
    const getCurrentLocation = async () => {
        try {
            // Check if geolocation api is supported by browser
            if (!navigator.geolocation) {
                updateCurrentLocationError('Your device does not support geolocation');
            } else {
                navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
            }
        } catch (err) {
            throw err;
        };
    };

    // Submit appointment to api
    const submitAppointmentApi = async (appointmentFrom, appointmentTo, subjectLine, reason, dateAndTimeString) => {        
        try {
            const url = 'referexpert/requestappointment';
            const body = {
                appointmentFrom,
                appointmentTo,
                dateAndTimeString,
                subject: subjectLine,
                reason,
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
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

        // Kill request if search input error
        if (searchError) return;

        // Current location is not supported or user rejected permission
        if (distanceType === 'currentLocation' && currentLocationError) return;

        try {
            // Show loading spinner inside doctors table
            updateLoadingDoctorsData(true);

            // Send request to api
            const results = await searchQueryApi({ distanceType, distanceAmount, searchType, searchQuery: searchValue });

            // Filter out current user and admin accounts
            const filteredResults = results.filter((user) => user.userType !== 'ADMIN' && user.email !== state.userEmail);

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
        updateValidateSubjectLine({ hasError: false, errorMessage: '' });
        updateValidateReason({ hasError: false, errorMessage: '' });
        updateValidateAppointmentTimestamp({ hasError: false, errorMessage: '' });
        let validateError = false;

        // Validate subject line input
        if (subjectLine.trim() === '') {
            updateValidateSubjectLine({ hasError: true, errorMessage: '' });
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
            const results = await submitAppointmentApi(state.userEmail, doctorDetails.email, subjectLine, reason, appointmentTimestamp);

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
        updateSubjectLine('');
        updateReason('');
        updateAppointmentTimestamp(null);

        // Clear appointment input validation states
        updateSubjectLine({ hasError: false, errorMessage: '' });
        updateValidateReason({ hasError: false, errorMessage: '' });
        updateValidateAppointmentTimestamp({ hasError: false, errorMessage: '' });
        
        // Hide dialog
        updateShowScheduleView(false);
    };

    // Query api when search has changed
    useEffect(async () => {
        getCurrentLocation();
    }, []);
    
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
                        <MenuItem value='speciality'>Specialty</MenuItem>
                        <MenuItem value='type'>Type</MenuItem>
                        <MenuItem value='firstName'>First name</MenuItem>
                        <MenuItem value='lastName'>Last name</MenuItem>
                    </Select>
                </FormControl>

                {/* Search input */}
                <TextField
                    name='search'
                    label='Search'
                    variant='outlined'
                    classes={{ root: `${ referpatientpageClasses.searchInput } ${ referpatientpageClasses.inputMarginRight }` }}
                    onChange={(event) => updateSearchValue(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' ? handleDoctorSearch() : null }
                    error={searchValueError.hasError}
                />

                {/* Distance types */}
                <FormControl variant='outlined' classes={{ root: referpatientpageClasses.inputMarginRight }}>
                    <InputLabel>Distance by</InputLabel>
                    <Select
                        name='distanceType'
                        label='Distance by'
                        value={distanceType}
                        onChange={(event) => updateDistanceType(event.target.value)}
                        error={distanceType === 'currentLocation' && currentLocationError ? true : false}
                    >
                        <MenuItem value='currentLocation'>Current Location</MenuItem>
                        <MenuItem value='distance'>Your address</MenuItem>
                        {/* <MenuItem value='address'>Address</MenuItem> */}
                    </Select>
                </FormControl>

                {/* Distance amount */}
                <FormControl variant='outlined' classes={{ root: referpatientpageClasses.inputMarginRight }}>
                    <InputLabel>Miles</InputLabel>
                    <Select
                        name='distanceAmount'
                        label='Miles'
                        value={distanceAmount}
                        onChange={(event) => updateDistanceAmount(event.target.value)}
                    >
                        <MenuItem value='15'>15</MenuItem>
                        <MenuItem value='30'>30</MenuItem>
                        <MenuItem value='45'>45</MenuItem>
                        <MenuItem value='60'>60</MenuItem>
                    </Select>
                </FormControl>

                {/* Button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    onClick={handleDoctorSearch}
                    style={{ height: '56px' }}
                >
                    Search
                </Button>
            </section>

            <div className='errorMessage'>{distanceType === 'currentLocation' && currentLocationError}</div>


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
                updateSubjectLine={updateSubjectLine}
                updateReason={updateReason}
                updateAppointmentTimestamp={updateAppointmentTimestamp}
                handleScheduleAppointment={handleScheduleAppointment}

                // Validation states
                validateSubjectLine={validateSubjectLine}
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