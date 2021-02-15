import { useState, useEffect, useCallback } from 'react';
import './styles/Adminpage.css';

// Utils
import createBasicAuth from '../utils/basicAuth';

// Debounce search input
import debounce from 'lodash.debounce';

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

function Adminpage() {
    const adminpageClasses = useStyles();

    // Loading states
    const [pageLoading, updatePageLoading] = useState(true);
    const [searchLoading, updateSearchLoading] = useState(false);

    // Data
    const [userData, updateUserData] = useState([]);
    const [userCounts, updateUserCounts] = useState({ total: 0, active: 0, pending: 0, disabled: 0 });

    // Search states
    const [searchType, updateSearchType] = useState('firstname');
    const [searchStatus, updateSearchStatus] = useState('all');
    const [searchInput, updateSearchInput] = useState('');

    // Page states
    const [page, updatePage] = useState(0);
    const [rowsPerPage, updateRowsPerPage] = useState(10);

    // Alert status
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Fetch user data
    const fetchUserData = async (type, query, pageLoad = false) => {
        try {

            // Execute two search queries to get all users if page load
            if (pageLoad) {
                const adminUrl = 'referexpert/users/type/admin';
                const userUrl = 'referexpert/users/type/p';

                // Fetch results
                const adminResponse = await fetch(adminUrl, { headers: { 'Authorization': createBasicAuth() }});
                const userResponse = await fetch(userUrl, { headers: { 'Authorization': createBasicAuth() }});
                const adminResults = await adminResponse.json();
                const userResults = await userResponse.json();

                // Join results
                return adminResults.concat(userResults);
            } else {

                // Send request to api
                const url = `referexpert/users/${type}/${query}`;
                const response = await fetch(url);
                return await response.json();
            };
        } catch (err) {
            updateUserData('error');
            console.log(err);
            return 'error';
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
        } catch(err) {
            
            // Show failed alert
            updateAlertDetails({ type: 'error', message: 'Failed to update user status' })
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

    // Handle a user search
    const handleSearch = async () => {
        let results;

        // Show loading spinner
        updateSearchLoading(true);

        // No search input, get all results
        if (searchInput.trim() === '') {
            results = await fetchUserData(null, null, { pageLoad: true });
        } else {
            results = await fetchUserData(searchType, searchInput);
        };

        // Filter by user status if one is chosen
        if (searchStatus !== 'all') {
            const filteredResults = results.filter((user) => user.isActive === searchStatus);
            updateUserData(filteredResults);
        } else {
            updateUserData(results);
        };

        // Hide loading spinner
        updateSearchLoading(false);
    };

    // Create counts
    function createUserCounts(data) {
        const counts = { total: 0, active: 0, pending: 0, disabled: 0 };
        
        // Loop through each user and count based on status
        data.map((user) => {

            // Add to totals count
            counts.total += 1;

            // Add to right bucket
            switch(user.isActive) {
                case 'Y':
                    counts.active += 1;
                    break;
                case 'P':
                    counts.pending += 1;
                    break;
                case 'N':
                    counts.disabled += 1;
                    break;
                default:
                    break;
            }
        });

        // Update counts state
        updateUserCounts(counts);
    };

    // Create table rows
    const createTableRows = (userList) => {
        return userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((user) => {
            const { userId, firstName, lastName, email, userType, isActive } = user;
            
            return (
                <TableRow key={userId}>
                    <TableCell>{ firstName } { lastName }</TableCell>
                    <TableCell>{ userType }</TableCell>
                    <TableCell>{ email }</TableCell>
                    <TableCell>
                        <Select
                            name='currentStatus'
                            variant='outlined'
                            value={isActive}
                            classes={{ root: adminpageClasses.statusChangeSelect }}
                            onChange={(event) => updateUserStatus(email, event.target.value)}
                        >
                            <MenuItem value='Y'><span className='statusCircle activeCircle' /> Active</MenuItem>
                            <MenuItem value='P'><span className='statusCircle pendingCircle' /> Pending</MenuItem>
                            <MenuItem value='N'><span className='statusCircle disabledCircle' /> Disabled</MenuItem>
                        </Select>
                    </TableCell>
                </TableRow>
            );
        });
    };

    // Don't update searchInput until user is done typing, aka debouncing
    const debouncedSearch = useCallback(
        debounce((searchQuery) => updateSearchInput(searchQuery), 600)
    ,[]);

    // Query api when search has changed
    useEffect(async () => {
        handleSearch(searchType, searchInput);
    }, [searchType, searchStatus, searchInput]);

    // Fetch users and create counts
    useEffect(async () => {
        const userList = await fetchUserData(null, null, { pageLoad: true });
        updateUserData(userList);

        // Failed to fetch all users, make counts 0
        if (userList === 'error') {
            createUserCounts([]);
        } else {
            createUserCounts(userList);
        };

        updatePageLoading(false);
    }, []);

    // Show loading if waiting on data
    if (pageLoading) {
        return (
            <section id='adminpage-body'>
                <div id='adminpage-loadingContainer'>
                    <CircularProgress size={80} />
                </div>
            </section>  
        );
    };

    // No search results row
    const noResults = (
        <TableRow>
            <TableCell colSpan={4}>
                <div className='noResults'>No results to display</div>
            </TableCell>
        </TableRow>
    );

    // Search error
    const errorResults = (
        <TableRow key={0}>
            <TableCell colSpan={5} >
                <div className='noResults errorMessage'>Sorry, this request failed. Please try again later.</div>
            </TableCell>
        </TableRow>
    );

    // Loading row
    const loadingRow = (
        <TableRow>
            <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                <CircularProgress className='noResults' size={25} />
            </TableCell>
        </TableRow>
    );

    // Determine what to show in table
    let tableRows;
    if (userData.length === 0) {
        tableRows = noResults;
    } else if (userData === 'error') {
        tableRows = errorResults;
    } else {
        tableRows = createTableRows(userData);
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
                    <InputLabel>Search type</InputLabel>
                    <Select
                        name='Search type'
                        label='Search type'
                        value={searchType}
                        onChange={(event) => updateSearchType(event.target.value)}
                    >
                        <MenuItem value='firstname'>First Name</MenuItem>
                        <MenuItem value='lastname'>Last Name</MenuItem>
                        <MenuItem value='type'>User type</MenuItem>
                    </Select>
                </FormControl>

                {/* User status */}
                <FormControl variant='outlined' classes={{ root: adminpageClasses.inputMargin }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name='status'
                        label='Status'
                        value={searchStatus}
                        onChange={(event) => updateSearchStatus(event.target.value)}
                    >
                        <MenuItem value='all'>All</MenuItem>
                        <MenuItem value='Y'>Active</MenuItem>
                        <MenuItem value='P'>Pending</MenuItem>
                        <MenuItem value='N'>Disabled</MenuItem>
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
                    onChange={(event) => debouncedSearch(event.target.value)}
                />
            </section>

            {/* Manage users card */}
            <TableContainer component={Paper}>
                <Table>

                    {/* Table header */}
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table body */}
                    <TableBody>{ !searchLoading ? tableRows : loadingRow }</TableBody>

                    {/* Table footer */}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50]}
                                colSpan={4}
                                count={userData.length}
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