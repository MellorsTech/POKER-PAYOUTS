import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import '../Styles/ThankYouSubmit.css';

function EmailThankYou() {
  return (
   <section className='ThankYouContainer'>
    <FaCircleCheck className='ThankYouIcon' />
    <h2 className='ThankYouDetails'>THANK YOU!</h2>
    <p>Email Submitted</p>
   </section>
  )
}

export default EmailThankYou
