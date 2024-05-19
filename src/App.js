import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Payouts from './components/Payouts';
import Deal from './components/Deal';
import ICM from './components/ICM';
import Contact from './components/Contact';
import ThankYou from './components/ThankYouSubmit'

import './Styles/App.css';


const App = () => {
    return (
        <Router>
            <Nav />
            <div className='app'>
                <Routes>
                    <Route path='/' element={ <Payouts /> } />
                    <Route path='/Deal' element={ <Deal /> } />
                    <Route path='/ICM' element={ <ICM /> } />
                    <Route path='/Contact' element={ <Contact /> } />
                    <Route path='/ThankYou' element={ <ThankYou / > } /> 
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App; 

