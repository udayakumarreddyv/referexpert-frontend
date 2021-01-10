import './styles/Header.css'

// Routing
import { Link } from 'react-router-dom';

// Material UI
import { Button } from '@material-ui/core';

function Header({ classes }) {
    return (
        <section id='headerBody'>
            {/* Logo */}
            <div id='headerLogoContainer'>
                <Link to='/' id='headerLogo'>ReferExpert</Link>
            </div>
            
            {/* Links */}
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
        </section>
    );
};

export default Header;
