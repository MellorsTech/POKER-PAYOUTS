import { FaBars } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import {useRef, useEffect} from 'react';
import Logo from '../assets/logo-em1.png'
import { Link } from 'react-router-dom';
import '../Styles/nav.css';


function Nav() {
    const navRef = useRef(null);

    const resizeNav = () => {
        if (window.innerWidth <= 1000) {
        navRef.current.classList.add('hide_nav');
        } else {
            navRef.current.classList.remove('hide_nav');
        }
    };

    useEffect(() => {
        resizeNav(); 

            window.addEventListener('resize', resizeNav);
            return () => {
                window.removeEventListener('resize', resizeNav);
            }
    }, []);

    const showNav = () => {
        if (window.innerWidth <= 1000) {
            navRef.current.classList.toggle('hide_nav')
        }
    };

    const hideNav = () => {
        if (window.innerWidth <= 1000) {
            navRef.current.classList.add('hide_nav')
        }
    };


  return (
        <header className='Container'>
            <div className='navContainer'>
                <div className='navLogo'>
                    <img className='logo' alt='Logo' src={Logo} />
                    <h1>PokerPayouts</h1>
                </div>
                <nav className='navMenu' ref={navRef}>
                    <Link className='link' to='/' onClick={ hideNav }>Payouts Calulator</Link>
                    <Link className='link' to='/Deal' onClick={ hideNav }>Deal Calculator</Link>
                    <Link className='link' to='/ICM' onClick={ hideNav }>ICM Calculator</Link>
                    <button className='nav-btn nav-close-btn' onClick={ showNav }>
                    <FaXmark className='closeX'/>
                </button>
                </nav>
                <button className='nav-btn' onClick={ showNav }>
                <FaBars/>
            </button>
            </div>
        </header>
  )
};

export default Nav;
