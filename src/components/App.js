import './styles/App.css';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import ErrorBoundary from './ErrorBoundary';

// Pages
import Homepage from '../pages/Homepage';
import Registerpage from '../pages/Registerpage';
import Loginpage from '../pages/Loginpage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import Userpage from '../pages/Userpage';
import Adminpage from '../pages/Adminpage';
import ProfilePage from '../pages/Profilepage';
import ReferPatientpage from '../pages/ReferPatientpage';
import ConfirmPage from '../pages/Confirmpage';
import Referralspage from '../pages/Referralspage';
import Contactpage from '../pages/Contactpage';
import PatientTimepage from '../pages/PatientTimepage';

// Components
import Header from './Header';
import Footer from './Footer';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

// Font family
require('typeface-roboto');

// Material UI styles
const useStyles = makeStyles((theme) => ({
    primaryButton: {
        color: '#ffffff',
        backgroundColor: theme.palette.primary.main,
        fontFamily: 'inherit',
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
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
            <div id='headerContainer'>
                <Header classes={classes} />
            </div>

            <div id='bodyContainer'>
                <ErrorBoundary>
                    <Switch>
                        {/* Refer patient page */}
                        <PrivateRoute path='/refer' classes={classes} component={ReferPatientpage} />

                        {/* Referrals page */}
                        <PrivateRoute path='/referrals' classes={classes} component={Referralspage} />

                        {/* Profile page */}
                        <PrivateRoute path='/profile' classes={classes} component={ProfilePage} />
                        
                        {/* Contact page */}
                        <PrivateRoute path='/contact' classes={classes} component={Contactpage} />

                        {/* Patient time confirm page */}
                        <Route path='/patientconfirmation'>
                            <PatientTimepage classes={classes} />
                        </Route>

                        {/* Login page */}
                        <Route path='/signIn'>
                            <Loginpage classes={classes} />
                        </Route>

                        {/* Reset password page */}
                        <Route path='/resetpass'>
                            <ResetPasswordPage classes={classes} />
                        </Route>

                        {/* Confirm account page */}
                        <Route path='/confirm'>
                            <ConfirmPage classes={classes} />
                        </Route>
                        
                        {/* Sign up page */}
                        <Route path='/signUp'>
                            <Registerpage classes={classes} />
                        </Route>

                        {/* User page */}
                        <PrivateRoute path='/home' classes={classes} component={Userpage} />

                        {/* Admin page */}
                        <PrivateRoute path='/admin' classes={classes} component={Adminpage} />

                        {/* Homepage, not logged in */}
                        <Route path='/'>
                            <Homepage classes={classes} />
                        </Route>
                    </Switch>
                </ErrorBoundary>
            </div>

            <div id='footerContainer'>
                <Footer />
            </div>
        </div>
    );
}

export default App;
