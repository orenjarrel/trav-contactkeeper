import React, { useState, useContext, useEffect } from 'react'
import ContactContext from '../../context/contact/contactContext';

const ContactForm = () => {
  const contactContext = useContext(ContactContext);

  const { addContact, updateContact, clearCurrent, current } = contactContext;

  useEffect(() => {
    if(current !== null) {
      setContact(current);
    } else {
      setContact({
      name: '',
      email: '',
      webhook: '',
      type: 'tags'
    });
    }
  }, [contactContext, current]);  // dependencies 

  // This is the current state of the Form
  // FORM SUBMIT FLOW: 57.) Edit & Update Contact Action 10:40
  const [ contact, setContact ] = useState({
    name: '',
    email: '',
    webhook: '',
    type: 'tags'
  });

  // pulling these fieds out of "contact"
  const { name, email, webhook, type } = contact

  const onChange = event => setContact({ 
      ...contact, // <-- copy what's ever in the current state
      [event.target.name]: event.target.value  // <-- take current value (that's being changed); what's being typed
    });

  const onSubmit = e => {
   // when the form is submitted it's going to look for the "addContacts" method
    e.preventDefault();

    if(current === null) {
      console.log("ONSUBMIT----> entered")
      addContact(contact); // <-- "contact" is the state with our form fields
    } else {
      updateContact(contact)  // <-- workflow: 10:30 (Edit & Update...)
    }
    
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-main">{current ? 'Edit Contact' : 'Register'}</h2>
      <input 
        type="text"
        placeholder="Oncall"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input 
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={onChange}
      />
      <input 
        type="text"
        placeholder="Webhook"
        name="webhook"
        value={webhook}
        onChange={onChange}
      />
      <h5>Contact Type</h5>
      <input 
        type="radio" 
        name="type" 
        value="tags" 
        checked={type === 'tags'}
        onChange={onChange}
      /> Tags{' '}
      <input 
        type="radio" 
        name="type" 
        value="none" 
        checked={type === 'none'}
        onChange={onChange}
      /> None{' '}

      <div>
        <input type="submit" value={current ? 'Update Contact' : 'Add Contact'} className="btn btn-primary btn-block" />
      </div>

      {current && (<div>
        <button className='btn btn-light btn-block' onClick={clearAll}>
          Clear 
        </button>
      </div>
      )}
    </form>

  );
};

export default ContactForm
