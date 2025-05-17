import { useState, useEffect, Fragment } from 'react';
import './styles/Header.css'

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/userSlice';

// Utils
import CookieHelper from '../utils/cookieHelper';

// Routing
import { Link } from 'react-router-dom';

// Material UI
import {
    Badge,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { AccountCircle, ExitToApp, Home, Send, Share } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Material UI styles
const useStyles = makeStyles((theme) => ({
    accountIcon: {
        marginLeft: '5px',
    },
    listContainer: {
        width: '170px',
        padding: '10px',
    },
    listItem: {
        marginBottom: '10px',
    },
}));

// Check if we should show badge on account button
// This notifies the user that they have a pending task to attend to
const checkPendingActions = ({ pendingTasks }) => {
    let hasPendingTask = false;
    let pendingAppointment = false;
    let currentAppointment = false;
    let pendingAvailabilityResponse = false;

    // Check if there are any pending tasks
    if (pendingTasks) {
        pendingAppointment = pendingTasks.pendingAppointment === 'Y';
        currentAppointment = pendingTasks.currentAppointment === 'Y';
        pendingAvailabilityResponse = pendingTasks.pendingAvailabilityResponse === 'Y';

        // Update has pending task state
        if (pendingAppointment || currentAppointment || pendingAvailabilityResponse) {
            hasPendingTask = true;
        };
    };

    return {
        hasPendingTask,
        pendingAppointment,
        currentAppointment,
        pendingAvailabilityResponse
    };
};

function Header({ classes }) {
    const headerClasses = useStyles();
    const dispatch = useDispatch();
    
    // Get state from Redux
    const user = useSelector(state => state.user);
    const { loggedIn, userType } = user;

    // Menu states
    const [drawerOpen, updateDrawerOpen] = useState(false);

    // pending tasks states
    const [pendingTasksInfo, updatePendingTasksInfo] = useState({
        hasPendingTask: false,
        pendingAppointment: false,
        currentAppointment: false,
        pendingAvailabilityResponse: false
    });

    // Decide path of logo url
    let logoRoute = '/';
    if (loggedIn) {
        logoRoute = userType === 'ADMIN' ? '/admin' : '/home';
    }
    
    // Handle drawer open
    const handleDrawerOpen = () => {
        updateDrawerOpen(true);
    };

    // Handle drawer close
    const handleDrawerClose = () => {
        updateDrawerOpen(false);
    };

    // Handle logout click
    const handleLogout = () => {
        // close drawer
        handleDrawerClose();

        // Delete cookies
        CookieHelper.deleteCookie('accessCookie');
        CookieHelper.deleteCookie('refreshCookie');

        // Update global state
        dispatch(logoutUser());
    };

    // Update pending tasks info when pending tasks change
    useEffect(() => {
        const pendingInfo = checkPendingActions(user);
        updatePendingTasksInfo(pendingInfo);
    }, [user.pendingTasks]);

    // View when user is not logged in
    const notLoggedInView = (
        <div id='headerLinksContainer'>
            <Link to='/signIn' className='headerLink'>
                <Button
                    classes={{ root: classes.primaryButton }}
                    style={{ marginRight: '10px', fontSize: '12px', }}
                >
                    Sign in
                </Button>
            </Link>

            <Link to='/signUp' className='headerLink'>
                <Button
                    classes={{ root: classes.primaryButton }}
                    style={{ fontSize: '12px' }}
                >
                    Sign Up
                </Button>
            </Link>
        </div>
    );

    // View when user is logged in
    const loggedInView = (
        <div id='headerLinksContainer'>
            <Badge
                badgeContent=" "
                color='error'
                invisible={!pendingTasksInfo.pendingAvailabilityResponse}
            >
                <Button
                    variant='outlined'
                    style={{ marginRight: '0px', fontSize: '12px', }}
                    onClick={handleDrawerOpen}
                >
                    {user.userDetails.firstName} <AccountCircle className='primaryColor' classes={{ root: headerClasses.accountIcon }} />
                </Button>
            </Badge>

            {/* Drawer */}
            <Drawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                classes={{ root: headerClasses.drawerContainer }}
            >
                <List classes={{ root: headerClasses.listContainer }}>
                    {/* Logo */}
                    <ListItem classes={{ root: headerClasses.listItem }}>
                        <div className='logoText'>Cephalad</div>
                    </ListItem>

                    {/* Home */}
                    <ListItem classes={{ root: headerClasses.listItem }}>
                        <Link
                            to={logoRoute}
                            className='drawerItem headerLink primaryTextColor'
                            onClick={handleDrawerClose}
                        >
                            <Home />
                            <ListItemText classes={{ root: headerClasses.listItemText }}>
                                <div className='drawerItemText'>Home</div>
                            </ListItemText>
                        </Link>
                    </ListItem>

                    {/* Referrals page */}
                    {userType !== 'ADMIN' && (
                        <ListItem classes={{ root: headerClasses.listItem }}>
                            <Badge
                                variant='dot'
                                color='error'
                                invisible={!pendingTasksInfo.pendingAvailabilityResponse}
                            >
                                <Link
                                    to='/referrals'
                                    className='drawerItem headerLink primaryTextColor'
                                    onClick={handleDrawerClose}
                                >
                                    <Share />
                                    <ListItemText classes={{ root: headerClasses.listItemText }}>
                                        <div className='drawerItemText'>Referrals</div>
                                    </ListItemText>
                                </Link>
                            </Badge>
                        </ListItem>
                    )}

                    {/* Refer patient */}
                    {userType !== 'ADMIN' && (
                        <ListItem classes={{ root: headerClasses.listItem }}>
                            <Link
                                to='/refer'
                                className='drawerItem headerLink primaryTextColor'
                                onClick={handleDrawerClose}
                            >
                                <Send />
                                <ListItemText classes={{ root: headerClasses.listItemText }}>
                                    <div className='drawerItemText'>Refer patient</div>
                                </ListItemText>
                            </Link>
                        </ListItem>
                    )}

                    {/* Profile */}
                    <ListItem classes={{ root: headerClasses.listItem }}>
                        <Link
                            to='/profile'
                            className='drawerItem headerLink primaryTextColor'
                            onClick={handleDrawerClose}
                        >
                            <AccountCircle />
                            <ListItemText classes={{ root: headerClasses.listItemText }}>
                                <div className='drawerItemText'>Profile</div>
                            </ListItemText>
                        </Link>
                    </ListItem>

                    {/* Logout */}
                    <ListItem classes={{ root: headerClasses.listItem }}>
                        <div
                            className='drawerItem headerLink primaryTextColor'
                            onClick={handleLogout}
                        >
                            <ExitToApp />
                            <ListItemText classes={{ root: headerClasses.listItemText }}>
                                <div className='drawerItemText'>Logout</div>
                            </ListItemText>
                        </div>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );

    return (
        <section id='headerBody'>
            {/* Logo */}
            <div id='headerLogoContainer'>
                <Link to={logoRoute} className='headerLink'>
                    <div className='logoText'>Cephalad</div>
                </Link>
            </div>

            {/* Links */}
            {loggedIn ? loggedInView : notLoggedInView}
        </section>
    );
};

export default Header;
