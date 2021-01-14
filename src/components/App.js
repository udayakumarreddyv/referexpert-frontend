import { useState } from 'react';
import './styles/App.css';

// Routing
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

// Pages
import Homepage from '../pages/Homepage';
import Registerpage from '../pages/Registerpage';
import Loginpage from '../pages/Loginpage';
import Userpage from '../pages/Userpage';
import Adminpage from '../pages/Adminpage';
import ProfilePage from '../pages/Profilepage';

// Components
import Header from './Header';
import Footer from './Footer';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

// Font family
require('typeface-roboto');

// Material UI styles
const useStyles = makeStyles((theme) => ({
    primaryButton : {
        color: '#ffffff',
        backgroundColor: '#1261a0',
        fontFamily: 'inherit',
        "&:hover": {
            backgroundColor: '#0a4184',
        },
        "&:disabled": {
            backgroundColor: '#d2d2d2',
        }
    },
    textfield: {
        marginBottom: '10px',
        [theme.breakpoints.down(400)]: {
            width: '100%',
        },
    },
}));

function App() {
    const classes = useStyles();

    // User states
    const [isUserLoggedIn, updateIsUserLoggedIn] = useState(true);
    const [accountType, updateAccountType] = useState('user');

    return (
        <div className="App">
            <Router>
                <div id='headerContainer'>
                    <Header classes={classes} isUserLoggedIn={isUserLoggedIn} />
                </div>

                <div id='bodyContainer'>
                    <Switch>

                        {/* Profile page */}
                        <Route path='/profile'>
                            { isUserLoggedIn ? <ProfilePage classes={classes} /> : <Redirect to='/' /> }
                        </Route>

                        {/* Login page */}
                        <Route path='/signIn'>
                            { isUserLoggedIn ? <Redirect to='/' /> : <Loginpage classes={classes} /> }
                        </Route>

                        {/* Sign up page */}
                        <Route path='/signUp'>
                            { isUserLoggedIn ? <Redirect to='/' /> : <Registerpage classes={classes} /> }
                        </Route>

                        {/* Home page */}
                        <Route path='/'>
                            {/* User is not logged in */}
                            { !isUserLoggedIn ? <Homepage classes={classes} /> : null }
                            
                            {/* User is logged in and admin */}
                            { isUserLoggedIn && accountType === 'admin' ? <Adminpage classes={classes} /> : null }
                            
                            {/* User is logged in and user */}
                            { isUserLoggedIn && accountType === 'user' ? <Userpage classes={classes} /> : null }
                        </Route>

                    </Switch>
                </div>

                <div id='footerContainer'>
                    <Footer />
                </div>
            </Router>
        </div>
    );
};

export default App;
