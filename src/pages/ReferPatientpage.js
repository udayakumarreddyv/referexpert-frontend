import { useState } from 'react';
import './styles/ReferPatientpage.css';

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
} from '@material-ui/core';
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

    // Search states
    const [searchType, updateSearchType] = useState('name');
    const [searchValue, updateSearchValue] = useState('');
    const [searchZipCode, updateSearchZipCode] = useState('');
    const [searchValueError, updateSearchValueError] = useState({ hasError: false, errorMessage: '' });
    const [searchZipCodeError, updateSearchZipCodeError] = useState({ hasError: false, errorMessage: '' });

    // Doctor table states
    const [doctorsData, updateDoctorsData] = useState(null);
    const [loadingDoctorsData, updateLoadingDoctorsData] = useState(false);

    // Schedule appointment states
    // Doctor details
    const [doctorName, updateDoctorName] = useState('');
    const [doctorType, updateDoctorType] = useState('');
    const [doctorCity, updateDoctorCity] = useState('');
    const [doctorZipCode, updateDoctorZipCode] = useState('');
    // Input states
    const [patientName, updatePatientName] = useState('');
    const [reason, updateReason] = useState('');
    const [appointmentTime, updateAppointmentTime] = useState('');
    const [appointmentDate, updateAppointmentDate] = useState('');

    // View states
    const [showScheduleView, updateShowScheduleView] = useState(false);

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
        if (searchZipCode.trim() === '') {
            updateSearchZipCodeError({ hasError: true, errorMessage: '' });
            searchError = true;
        } else if (isNaN(searchZipCode) || searchZipCode.length !== 5) {
            updateSearchZipCodeError({ hasError: true, errorMessage: 'Invalid zip code' });
            searchError = true;
        } else {
            updateSearchZipCodeError({ hasError: false, errorMessage: '' });
        };

        // Kill request if search input error
        if (searchError) return;

        try {
            // Show loading spinner inside doctors table
            updateLoadingDoctorsData(true);

            // const url = '';
            // const response = fetch(url, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ searchValue, searchType, zipcode })
            // });
            // const results = await response.json();

            const results = [
                { id: 1, name: 'John smith', type: 'Family doctor', city: 'Memphis', zipcode: '38111' },
                { id: 2, name: 'Sally brown', type: 'Dermatologist', city: 'Memphis', zipcode: '38017' },
                { id: 3, name: 'Alton marx', type: 'Cardiologist', city: 'Memphis', zipcode: '38112' },
                { id: 4, name: 'Donna james', type: 'Gastroenterologist', city: 'Memphis', zipcode: '38118' },
            ];

            // Update doctors data state and hide loading spinner
            updateDoctorsData(results);
            updateLoadingDoctorsData(false);
        } catch (err) {
            updateLoadingDoctorsData(false);
            console.log(err);
        };
    };

    // Handle opening of scheduling dialog
    const handleOpenScheduleDialog = (name, type, city, zipcode) => {
        // Update doctor states
        updateDoctorName(name);
        updateDoctorType(type);
        updateDoctorCity(city);
        updateDoctorZipCode(zipcode);

        // Open dialog
        updateShowScheduleView(true);
    };

    // Handle closing of scheduling dialog
    const handleCloseScheduleDialog = () => {
        // Clear doctor states
        updateDoctorName('');
        updateDoctorType('');
        updateDoctorCity('');
        updateDoctorZipCode('');

        // Clear appointment states
        updatePatientName('');
        updateReason('');
        updateAppointmentTime('');
        updateAppointmentDate('');

        // Hide dialog
        updateShowScheduleView(false);
    };

    console.log(doctorsData)
    
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
                        <MenuItem value='name'>Name</MenuItem>
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
                <TextField
                    name='zipcode'
                    label='Zipcode'
                    variant='outlined'
                    classes={{ root: `${ referpatientpageClasses.searchInput } ${ referpatientpageClasses.zipcodeInput } ${ referpatientpageClasses.inputMarginRight }` }}
                    onChange={(event) => updateSearchZipCode(event.target.value)}
                    error={searchZipCodeError.hasError}
                    helperText={searchZipCodeError.errorMessage}

                />

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

                // View states
                showScheduleView={showScheduleView}
                handleCloseScheduleDialog={handleCloseScheduleDialog}

                // Doctor info
                doctorName={doctorName}
                doctorType={doctorType}
                doctorCity={doctorCity}
                doctorZipCode={doctorZipCode}

                // Input states
                updatePatientName={updatePatientName}
                updateReason={updateReason}
                // handleScheduleAppointment={}
            />
        </section>
    );
};

export default ReferPatientpage;