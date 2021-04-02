import { useContext, useState } from 'react';
import './styles/Header.css'

// Global store
import { Context } from '../store/GlobalStore';

// Utils
import CookieHelper from '../utils/cookieHelper';

// Routing
import { Link } from 'react-router-dom';

// Material UI
import {
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { AccountCircle, ExitToApp, Home, Send } from '@material-ui/icons';
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

function Header({ classes, isUserLoggedIn, accountType }) {
    const headerClasses = useStyles();
    const [state, dispatch] = useContext(Context);
    const logoRoute = state.userType === 'admin' ? '/admin' : '/home';

    // Menu states
    const [drawerOpen, updateDrawerOpen] = useState(false);
    
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
        updateDrawerOpen(false);

        // Delete cookie
        CookieHelper.deleteCookie('accessCookie');
    
        // Logout user in state
        dispatch({ type: 'LOGOUT_USER', payload: null });
    };

    // View when user is not logged in
    const notLoggedInView = (
        <div id='headerLinksContainer'>
            <Link to='/signIn' className='headerLink'>
                <Button
                    variant='outlined'
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
            <Button
                variant='outlined'
                style={{ marginRight: '10px', fontSize: '12px', }}
                onClick={handleDrawerOpen}
            >
                Andrew <AccountCircle className='primaryColor' classes={{ root: headerClasses.accountIcon }} />
            </Button>

            {/* Drawer */}
            <Drawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                classes={{ root: headerClasses.drawerContainer }}
            >
                <List classes={{ root: headerClasses.listContainer }}>

                    {/* Logo */}
                    <ListItem classes={{ root: headerClasses.listItem }}>
                        <div className='logoText'>ReferExpert</div>
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

                    {/* Refer patient */}
                    {
                        accountType === 'user'
                        ? <ListItem classes={{ root: headerClasses.listItem }}>
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
                        : null
                    }

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
                <Link to={logoRoute} id='headerLogo'>ReferExpert</Link>
            </div>
            
            {/* Show view based on if user is logged in or not */}
            { state.loggedIn ? loggedInView : notLoggedInView }
        </section>
    );
};

export default Header;
