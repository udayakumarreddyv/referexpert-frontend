import { useState, useEffect } from 'react';
import './styles/Adminpage.css';

// Material UI
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Paper,
    TextField,
    CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Custom Material UI styles for this page
const useStyles = makeStyles((theme) => ({
    inputMargin: {
        marginLeft: '10px',
    },
    searchInput: {
        width: '250px',
        [theme.breakpoints.down(400)]: {
            width: '75%',
            marginBottom: '10px',
        },
    },
    statusChangeSelect: {
        width: '65px',
        padding: '10px',
        fontSize: '13px'
    }
}));

function Adminpage({ classes }) {
    const adminpageClasses = useStyles();

    // Data
    const [userData, updateUserData] = useState([]);
    const [userCounts, updateUserCounts] = useState(null);

    // Search states
    const [searchValue, updateSearchValue] = useState('');
    const [searchType, updateSearchType] = useState('all');
    const [searchStatus, updateSearchStatus] = useState('all');
    const [page, updatePage] = useState(0);
    const [rowsPerPage, updateRowsPerPage] = useState(10);

    // Alert status
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Fetch user data
    const fetchUserData = async () => {
        try {
            
            // Send request to api
            // const url = '';
            // const response = await fetch(url);
            // const results = await response.json();
            
            const results = [
                { firstName: 'Andrew', lastName: 'Elick', email: 'andy.elick@gmail.com', status: 'active' },
                { firstName: 'James', lastName: 'Smith', email: 'james_smith@yahoo.com', status: 'pending' },
                { firstName: 'Rhonda', lastName: 'Brown', email: 'rhonda23@outlook.com', status: 'disabled' },
                { firstName: 'Sally', lastName: 'Silver', email: 'silvaSalls@gmail.com', status: 'active' },
                { firstName: 'Ashish', lastName: 'Thakur', email: 'ashishT@icloud.com', status: 'active' },
                { firstName: 'Satoshi', lastName: 'Moore', email: 'bigworm69@gmail.com', status: 'disabled' },
            ];

            // Update data state
            updateUserData(results)
        } catch (err) {
            // TODO: Catch loading errors
            console.log(err);
        }
    };

    // Update status of user
    const updateUserStatus = async (email, status) => {
        try {
            // const url = '';
            // const response = await fetch(url, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, status })
            // });
            // const results = await response.json();

            // Update user status in current data
            for (let index in userData) {
                const currentUser = userData[index];
                if (currentUser.email === email) currentUser.status = status;
            };
            
            // Show success alert
            updateAlertDetails({ type: 'success', message: 'User status has been updated!' });
            updateAlertOpen(true);
            // console.log(results);
        } catch(err) {
            
            // Show failed alert
            updateAlertDetails({ alert: 'error', message: 'Failed to update user status' })
            updateAlertOpen(true);
            console.log(err);
        };
    };

    // Change pagination page
    const handleChangePage = (event, newPage) => {
        updatePage(newPage);
    };
    
    // Change pagaination count amount
    const handleChangeRowsPerPage = (event) => {
        updateRowsPerPage(parseInt(event.target.value, 10));
        updatePage(0);
    };

    // Filter rows based on search
    const filterSearchResults = (user) => {
                
        // Filter out users with wrong status
        if (searchStatus !== 'all' && searchStatus !== user.status) {
            return;
        };

        // No search yet, skip filtering
        if (searchValue.trim() === '') {
            return user;
        };

        const firstName = user.firstName.toLowerCase();
        const lastName = user.lastName.toLowerCase();
        const email = user.email.toLowerCase();
        const searchResult = searchValue.toLowerCase();
                
        switch (searchType) {
            case 'firstName':
                if (firstName.includes(searchResult)) return user;
                break;
            case 'lastName':
                if (lastName.includes(searchResult)) return user;
                break;
            case 'email':
                if (email.includes(searchResult)) return user;
                break;
            case 'all':
                if (
                    firstName.includes(searchResult)
                    || lastName.includes(searchResult)
                    || email.includes(searchResult)
                ) return user;
                break;
            default:
                return user;
        };
    };

    // Create counts
    function createUserCounts(data) {
        const counts = { total: 0, active: 0, pending: 0, disabled: 0 };
        
        // Loop through each user and count based on status
        data.map((user) => {

            // Add to totals count
            counts.total += 1;

            // Add to right bucket
            switch(user.status) {
                case 'active':
                    counts.active += 1;
                    break;
                case 'pending':
                    counts.pending += 1;
                    break;
                case 'disabled':
                    counts.disabled += 1;
                    break;
                default:
                    break;
            }
        });

        // Update counts state
        updateUserCounts(counts);
    };

    // Filter data based on search
    const cleanedUserResults = userData.filter((user) => filterSearchResults(user));
     
    // Create table rows
    const tableRows = cleanedUserResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((user) => {
        const { firstName, lastName, email, status } = user;
        
        return (
            <TableRow key={email}>
                <TableCell>{ firstName }</TableCell>
                <TableCell>{ lastName }</TableCell>
                <TableCell>{ email }</TableCell>
                <TableCell>
                    <Select
                        name='currentStatus'
                        variant='outlined'
                        value={status}
                        classes={{ root: adminpageClasses.statusChangeSelect }}
                        onChange={(event) => updateUserStatus(email, event.target.value)}
                    >
                        <MenuItem value='active'><span className='statusCircle activeCircle' /> Active</MenuItem>
                        <MenuItem value='pending'><span className='statusCircle pendingCircle' /> Pending</MenuItem>
                        <MenuItem value='disabled'><span className='statusCircle disabledCircle' /> Disabled</MenuItem>
                    </Select>
                </TableCell>
            </TableRow>
        );
    });

    // Create user counts
    useEffect(() => {
        if (userData.length === 0) fetchUserData();
        if (userData.length !== 0 && !userCounts) createUserCounts(userData);
    }, [userData, userCounts])

    // Show loading if waiting on data
    if (userData.length === 0 || !userCounts) {
        return (
            <section id='adminpage-body'>
                <div id='adminpage-loadingContainer'>
                    <CircularProgress size={80} />
                </div>
            </section>  
        );
    };
    
    // Default page view
    return (
        <section id='adminpage-body'>

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

            {/* Stats section */}
            <h1 className='pageTitle'>User stats</h1>
            <section id='adminpage-statsContainer'>

                {/* Total users */}
                <div className='adminpage-statsItem'>
                    <div className='adminpage-statsTitle secondaryTextColor'>Total users</div>
                    <div className='adminpage-statsNumber primaryTextColor'>{ userCounts.total }</div>
                </div>

                {/* Active users */}
                <div className='adminpage-statsItem'>
                    <div className='adminpage-statsTitle secondaryTextColor'>Active users</div>
                    <div className='adminpage-statsNumber primaryTextColor'>{ userCounts.active }</div>
                </div>

                {/* Pending users */}
                <div className='adminpage-statsItem'>
                    <div className='adminpage-statsTitle secondaryTextColor'>Pending users</div>
                    <div className='adminpage-statsNumber primaryTextColor'>{ userCounts.pending }</div>
                </div>

                {/* Disabled users */}
                <div className='adminpage-statsItem'>
                    <div className='adminpage-statsTitle secondaryTextColor'>Disabled users</div>
                    <div className='adminpage-statsNumber primaryTextColor'>{ userCounts.disabled }</div>
                </div>
            </section>

            {/* Search section */}
            <h1 className='pageTitle'>Manage users</h1>
            <section id='adminpage-searchContainer'>

                {/* Search types */}
                <FormControl variant='outlined' classes={{ root: adminpageClasses.inputMargin }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        name='Type'
                        label='Type'
                        value={searchType}
                        onChange={(event) => updateSearchType(event.target.value)}
                    >
                        <MenuItem value='all'>All</MenuItem>
                        <MenuItem value='firstName'>First Name</MenuItem>
                        <MenuItem value='lastName'>Last Name</MenuItem>
                        <MenuItem value='email'>Email</MenuItem>
                    </Select>
                </FormControl>

                {/* Status */}
                <FormControl variant='outlined' classes={{ root: adminpageClasses.inputMargin }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name='status'
                        label='Status'
                        value={searchStatus}
                        onChange={(event) => updateSearchStatus(event.target.value)}
                    >
                        <MenuItem value='all'>All</MenuItem>
                        <MenuItem value='active'>Active</MenuItem>
                        <MenuItem value='pending'>Pending</MenuItem>
                        <MenuItem value='disabled'>Disabled</MenuItem>
                    </Select>
                </FormControl>

                {/* Search input */}
                <TextField
                    name='search'
                    label={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <Search fontSize='small' />
                            Search
                        </span>
                    }
                    variant='outlined'
                    classes={{ root: `${ adminpageClasses.searchInput } ${ adminpageClasses.inputMargin }` }}
                    onChange={(event) => updateSearchValue(event.target.value)}
                />
            </section>

            {/* Manage users card */}
            <TableContainer component={Paper}>
                <Table>

                    {/* Table header */}
                    <TableHead>
                        <TableRow>
                            <TableCell>First name</TableCell>
                            <TableCell>Last name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table body */}
                    <TableBody>{ tableRows }</TableBody>

                    {/* Table footer */}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50]}
                                colSpan={4}
                                count={cleanedUserResults.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </section>
    );
};

export default Adminpage;