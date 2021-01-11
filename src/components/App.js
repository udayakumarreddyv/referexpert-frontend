import './styles/App.css';

// Routing
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

// Pages
import Homepage from '../pages/Homepage';
import Registerpage from '../pages/Registerpage';
import Loginpage from '../pages/Loginpage';
import Adminpage from '../pages/Adminpage';

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

    return (
        <div className="App">
            <Router>
                <div id='headerContainer'>
                    <Header classes={classes} />
                </div>

                <div id='bodyContainer'>
                    <Switch>

                        {/* Admin page */}
                        <Route path='/admin'>
                            <Adminpage classes={classes} />
                        </Route>

                        {/* Login page */}
                        <Route path='/signIn'>
                            <Loginpage classes={classes} />
                        </Route>

                        {/* Sign up page */}
                        <Route path='/signUp'>
                            <Registerpage classes={classes} />
                        </Route>

                        {/* Profile page */}
                        <Route path='/profile'>

                        </Route>

                        {/* Home page */}
                        <Route path='/'>
                            <Homepage classes={classes} />
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
