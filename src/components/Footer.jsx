import React from "react";
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo-em1.png';
import '../Styles/footer.css';

function Footer() {

    let Navigate  = useNavigate();

    const goToContact = () => {
        const contact = `/Contact`;
        Navigate(contact);
    }

    return (
        <footer>
            <div className="footer">
                <img src={Logo} alt='Logo' className='footerlogo' />
                <div className="Contact">
                    <button className="contact-btn" onClick={ goToContact }>Contact Us
                    </button>
                    <p className="contactText">If you find a problem, have a questions or idea? Contact us.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
