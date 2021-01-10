import './styles/Homepage.css';

// Routing
import { Link } from 'react-router-dom';

// Material UI
import {
    Button,
    Card,
} from '@material-ui/core';
import { Assignment, Today, Search, Send } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

// Material UI Homepage styles
const useStyles = makeStyles((theme) => ({
    explanationCard: {
        width: '40%',
        maxWidth: '250px',
        marginBottom: '20px',
        padding: '20px',
        [theme.breakpoints.down(400)]: {
            width: '100%',
        },
        [theme.breakpoints.up(1000)]: {
            marginRight: '20px',
        }
    },
    icon: {
        paddingRight: '5px',
        color: '#1261a0',
    }
}));

function Homepage({ classes }) {
    const homepageClasses = useStyles();

    return (
        <section id='homePageBody'>

            {/* Landing image */}
            <img
                src={process.env.PUBLIC_URL + '/patientDoctor.jpg'}
                id='homepage-splashImage'
                alt='Doctor helping their patient'
            />

            {/* Landing card */}
            <section id='homepage-landingCard'>
                <h1 id='homepage-headerText' className='primaryTextColor'>Helping doctors connect one patient at a time</h1>
                <p id='homepage-subText' className='secondaryTextColor'>A solution that solves the hassle referring and scheduling</p>
                
                <Link to='signUp' style={{ textDecoration: 'none' }}>
                    <Button classes={{ root: classes.primaryButton }}>Join today</Button>
                </Link>
            </section>
            
            {/* Explaination card */}
            <section id='homepage-explanationCard'>
                <Card elevation={2} classes={{ root: homepageClasses.explanationCard }}>
                    <h3 className='homepage-explanationTitle'>
                        <Search classes={{ root: homepageClasses.icon }} />
                        Find a physician
                    </h3>
                    <div className='homepage-explanationText'>Choose from list of physicians for quick discovery</div>
                </Card>

                <Card elevation={2} classes={{ root: homepageClasses.explanationCard }}>
                    <h3 className='homepage-explanationTitle'>
                        <Send classes={{ root: homepageClasses.icon }} />
                        Refer a patient
                    </h3>
                    <div className='homepage-explanationText'>Allow your patients to book their next appointment</div>
                </Card>

                <Card elevation={2} classes={{ root: homepageClasses.explanationCard }}>
                    <h3 className='homepage-explanationTitle'>
                        <Today classes={{ root: homepageClasses.icon }} />
                        Schedule appoinments
                    </h3>
                    <div className='homepage-explanationText'>Accept or reject appointments without the hassle of any phonecalls</div>
                </Card>

                <Card elevation={2} classes={{ root: homepageClasses.explanationCard }}>
                    <h3 className='homepage-explanationTitle'>
                        <Assignment classes={{ root: homepageClasses.icon }} />
                        Manage appoinments
                    </h3>
                    <div className='homepage-explanationText'>View all your appointments in one place to keep you focused on what is important</div>
                </Card>
            </section>
        
        </section>
    );
};

export default Homepage;
