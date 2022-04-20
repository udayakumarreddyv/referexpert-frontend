import './styles/Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div id='footerBody'>

            {/* Logo */}
            <div id='footerLogoContainer'>
                <Link to='/' id='footerLogo'>Cephalad</Link>
            </div>
            
            {/* Site links */}
            <div id='footerLinksContainer'>
                <Link to='/contact' className='footerLink link'>Contact</Link>
                <Link to='/terms' className='footerLink link'>Terms</Link>
                <Link to='/privacy' className='footerLink link'>Privacy</Link>
                <Link to='/sitemap' className='footerLink link'>Sitemap</Link>
            </div>
        </div>
    );
};

export default Footer;
