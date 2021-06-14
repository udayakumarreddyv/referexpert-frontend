import { useState, useEffect, useContext, useCallback } from 'react';
import './styles/Adminpage.css';

// Global store
import { Context } from '../store/GlobalStore';

// Components
import InviteDoctorDialog from '../components/InviteDoctorDialog';

// Utils
import debounce from 'lodash.debounce'; // debounce search

// Material UI
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
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
    TextField,
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
    const [state, dispatch] = useContext(Context);
    const adminpageClasses = useStyles();

    // Loading states
    const [pageLoading, updatePageLoading] = useState(true);
    const [searchLoading, updateSearchLoading] = useState(false);

    // Data
    const [userData, updateUserData] = useState([]);
    const [userCounts, updateUserCounts] = useState({ total: 0, active: 0, pending: 0, disabled: 0 });

    // Search states
    const [searchType, updateSearchType] = useState('firstName');
    const [searchStatus, updateSearchStatus] = useState('all');
    const [searchInput, updateSearchInput] = useState('');

    // Update user status states
    const [userStatusEmail, updateStatusEmail] = useState('');
    const [newUserStatus, updateNewUserStatus] = useState('');

    // Page states
    const [page, updatePage] = useState(0);
    const [rowsPerPage, updateRowsPerPage] = useState(10);

    // Alert status
    const [alertOpen, updateAlertOpen] = useState(false);
    const [alertDetails, updateAlertDetails] = useState({ type: 'success', message: '' });

    // Dialog states
    const [dialogInviteDoctorOpen, updateDialogInviteDoctorOpen] = useState(false);
    const [dialogChangeStatusOpen, updateDialogUpdateStatusOpen] = useState(false);

    // Fetch user counts
    const fetchUserCounts = async () => {
        try {
            const url = 'referexpert/users/count';
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` } });
            
            // Error message
            if (response.status !== 200) throw response;

            return await response.json();
        } catch (err) {
            console.log(err);
            return 'error';
        };
    };

    // Handle opening "are you sure" dialog for updating user status
    const handleOpenChangeStatusDialog = (email, newStatus) => {
        updateStatusEmail(email);
        updateNewUserStatus(newStatus);
        updateDialogUpdateStatusOpen(true);
    };

    // Handle closing the "are you sure" dialog
    const handleCloseChangeStatusDialog = () => {
        updateStatusEmail('');
        updateNewUserStatus('');
        updateDialogUpdateStatusOpen(false);  
    };

    // Update status of user
    const updateUserStatus = async () => {
        try {

            // Close the dialog
            updateDialogUpdateStatusOpen(false);

            // Check status to determine api endpoint to use
            let url = 'referexpert/';
            switch (newUserStatus) {
                case 'Y':
                    url = url + 'activeuser';
                    break;
                case 'P':
                    updateAlertDetails({ type: 'error', message: 'Pending is not a selectable option, please choose either Active or Disabled' });
                    updateAlertOpen(true);
                    return 'Pending, do no update'
                case 'N':
                    url = url + 'deactiveuser';
                    break;
                default:
                    throw 'Invalid option for parameter status, must be: Y, P, or N';
            };

            // Send request to api to update user status
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`
                },
                body: JSON.stringify({ email: userStatusEmail })
            });
            const results = await response.json();

            // Unhandled error response
            if (!('message' in results)) throw results;
            
            // Didn't get a success message for either action
            if (
                results.message !== 'Activated Successfully'
                && results.message !== 'Deactivated Successfully'
            ) {
                throw results.message;
            };

            // Update changes to user status in current user data
            updateUserData(userData.map((user) => user.email === userStatusEmail ? { ...user, isActive: newUserStatus } : user));
            
            // Show success alert
            updateAlertDetails({ type: 'success', message: 'User status has been updated!' });
            updateAlertOpen(true);

            // Update user counts
            const countResults = await fetchUserCounts();
            updateUserCounts(countResults);
            updatePageLoading(false);
        } catch(err) {
            
            // Show failed alert
            updateAlertDetails({ type: 'error', message: 'Failed to update user status' })
            updateAlertOpen(true);
            console.log(err);
        } finally {
            handleCloseChangeStatusDialog();
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
        try {
            // Show loading spinner
            updateSearchLoading(true);

            // Send request to api
            const url = `referexpert/users?active=A&${searchType}=${searchInput}`;
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` } });
            const results =  await response.json();
            
            // Filter by user status if one is chosen
            if (searchStatus !== 'all') {
                const filteredResults = results.filter((user) => user.isActive === searchStatus);
                updateUserData(filteredResults);
            } else {
                updateUserData(results);
            };

            // Hide loading spinner
            updateSearchLoading(false);

        } catch (err) {
            updateUserData('error');
            console.log(err);
            return 'error';
        };
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
                            onChange={(event) => handleOpenChangeStatusDialog(email, event.target.value)}
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
        debounce((searchQuery) => updateSearchInput(searchQuery), 800)
    ,[]);

    // Query api when search has changed
    useEffect(async () => {
        if (searchInput.length > 2) handleSearch(searchType, searchInput);
    }, [searchType, searchStatus, searchInput]);

    // Get user counts on page load
    useEffect(async () => {
        const results = await fetchUserCounts();
        updateUserCounts(results);
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

            {/* Top bar for holding buttons */}
            <section id='userpage-topBar'>

                {/* Invite doctor button */}
                <Button
                    classes={{ root: classes.primaryButton }}
                    style={{ marginRight: '10px' }}
                    onClick={() => updateDialogInviteDoctorOpen(true)}
                >
                    Invite doctor
                </Button>
            </section>

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
                        <MenuItem value='firstName'>First Name</MenuItem>
                        <MenuItem value='lastName'>Last Name</MenuItem>
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

            {/* Invite doctor dialog component */}
            <InviteDoctorDialog
                classes={classes}
                
                userEmail={state.userEmail}
                dialogInviteDoctorOpen={dialogInviteDoctorOpen}
                updateDialogInviteDoctorOpen={updateDialogInviteDoctorOpen}
                updateAlertDetails={updateAlertDetails}
                updateAlertOpen={updateAlertOpen}
            />

            {/* "Are you sure" status update dialog component */}
            <Dialog
                open={dialogChangeStatusOpen}
                onClose={handleCloseChangeStatusDialog}
                aria-labelledby="change-status"
                aria-describedby="Update the status of a user"
            >
                {/* Title */}
                <DialogTitle id="alert-dialog-title">Are you sure you would like to change this user's status?</DialogTitle>
                
                {/* Description */}
                <DialogContent>
                    <DialogContentText>Changing this user's status could affect their usage of our application.</DialogContentText>
                    {/* <div className='errorMessage'>{ inviteDoctorSubmitError.errorMessage }</div> */}
                </DialogContent>

                {/* Action buttons */}
                <DialogActions>
                    <Button onClick={handleCloseChangeStatusDialog}>Cancel</Button>
                    <Button
                        classes={{ root: classes.primaryButton }}
                        onClick={updateUserStatus}
                        // disabled={statusUpdateLoading}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Alert popups, only shown when user status has been updated */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
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

export default Adminpage;