import { useState } from 'react';
import './styles/App.css';

// Routing
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

// Global store
import Store from '../store/GlobalStore';

// Pages
import Homepage from '../pages/Homepage';
import Registerpage from '../pages/Registerpage';
import Loginpage from '../pages/Loginpage';
import Userpage from '../pages/Userpage';
import Adminpage from '../pages/Adminpage';
import ProfilePage from '../pages/Profilepage';
import ReferPatientpage from '../pages/ReferPatientpage';

// Components
import Header from './Header';
import Footer from './Footer';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import { Home } from '@material-ui/icons';

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

    return (
        <div className="App">
            <Store>
                <Router>
                    <div id='headerContainer'>
                        <Header classes={classes} />
                    </div>

                    <div id='bodyContainer'>
                        <Switch>

                            {/* Refer patient page */}
                            <PrivateRoute path='/refer' classes={classes} component={ReferPatientpage} />

                            {/* Profile page */}
                            <PrivateRoute path='/profile' classes={classes} component={ProfilePage} />
                            
                            {/* Login page */}
                            <Route path='/signIn'>
                                <Loginpage classes={classes} />
                            </Route>

                            {/* Sign up page */}
                            <Route path='/signUp'>
                                <Registerpage classes={classes} />
                            </Route>

                            {/* User page */}
                            <PrivateRoute path='/home' classes={classes} component={Userpage} />

                            {/* Admim page */}
                            <PrivateRoute path='/admin' component={Adminpage} />

                            {/* Homepage, not logged in */}
                            <Route to='/'>
                                <Homepage classes={classes} />
                            </Route>
                        </Switch>
                    </div>

                    <div id='footerContainer'>
                        <Footer />
                    </div>
                </Router>
            </Store>
        </div>
    );
};

export default App;
