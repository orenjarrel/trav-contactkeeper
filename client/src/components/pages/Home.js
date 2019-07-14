import React, { useContext, useEffect } from 'react'
import Contacts from '../contacts/Contacts';
import ContactForm from '../contacts/ContactForm';
import AuthContext from '../../context/auth/authContext';
import ContactFilter from '../contacts/ContactFilter';

const Home = () => {
  const authContext = useContext(AuthContext);

  // we want to to run as soon as this Component (page) loads
  useEffect(() => {
    authContext.loadUser(); // <- will look at the token, hit backend, put user into State
    // eslint-disable-next-line
  }, []);


  return (
    <div className='grid-2'>
      <div>
        <ContactForm />
      </div>

      <div>
        <ContactFilter />
        <Contacts />
      </div>
    </div>
  )
}

export default Home
