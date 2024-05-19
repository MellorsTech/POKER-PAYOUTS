import { useState } from 'react'
import '../Styles/Contact.css'

export default function Contact() {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [body, setBody] = useState('');

    const resetEmail = (e) => setEmail(e.target.value);
    const resetName = (e) => setName(e.target.value);
    const resetBody = (e) => setBody(e.target.value);

  return (
    <section className='contactForm' >
        <h2 className='contactHeading'>Contact Us</h2>
        <form className='contactForm' action='https://formsubmit.co/f8fae2c2c38afce14f2151694c845a25' method='POST'>
            <label htmlFor='email'>Email</label>
            <input
                name='email'
                id='email'
                type='email'
                placeholder='Enter Email Address...'
                value={ email }
                onChange={ resetEmail }
                required
            ></input>
            <label htmlFor='name'>Full Name</label>
            <input
                name='name'
                id='name'
                type='name'
                placeholder='Enter Full Name..'
                value={ name }
                onChange={ resetName }
                required
            ></input>
            <label htmlFor='body'>How can we help you?</label>
            <textarea
                name='body'
                id='body'
                rows='5'
                placeholder='Enter Deatils...'
                value={ body }
                onChange={ resetBody }
                required
            ></textarea>
            <button type='submit' className='contactBtn' id='contactBtn' >Send</button>
            <input type="hidden" name="_cc" value="josh.mellors@outlook.com"></input>
            <input type="text" name="_honey" className='honey'></input>
            <input type="hidden" name="_captcha" value="false"></input>
            <input type="hidden" name="_next" value="http://localhost:3000/ThankYou"></input>
        </form>
    </section>

  )
}
