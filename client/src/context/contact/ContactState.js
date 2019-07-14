import React, { useReducer } from 'react';
import uuid from 'uuid';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
// import fetch from 'sentry-fetch'

import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
} from '../types';

const ContactState = props => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: 'aws-mp-dca-ops',
        email: 'aws-mp-dca-ops@amazon.com',
        webhook: 'http://www.chime.amazon.com',
        type: 'tags'
      },
      {
        id: 2,
        name: 'venture-rs-dev-ops',
        email: 'venture-ops@amazon.com',
        webhook: 'http://www.chime.amazon.com',
        type: 'none'
      },
      {
        id: 3,
        name: 'workspaces-dca-ops',
        email: 'workspaces-ops@amazon.com',
        webhook: 'http://www.chime.amazon.com',
        type: 'tags'
      }
    ],

    current: null,
    filtered: null
  };

  // state: allows us to access anything in our state
  // dispatch: allows us to dispatch objects to the reducer
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Add Contact
  const addContact = contact => {
    contact.id = uuid.v4();
    try {
      // const res = fetch('/api/v1/oncall', {method: 'POST', body: JSON.stringify(contact), credentials: 'same-origin'})
      // .then(function(res) {
      //   console.log("data received", res)
      // })
      dispatch({
      type: ADD_CONTACT, 
      payload: contact
    });
  
    } catch (error) {
      console.log("ERRORS IN FETCH", error)

    }

    // try {
    //   console.log("ADDCONTACT -----> entered", contact)
    //   contact.id = uuid.v4();
    //   dispatch({
    //     type: ADD_CONTACT, payload: contact
    // });
    // } catch (err) {
    //   console.log("NOOO ERRORS!!")
    // }

  };
  

  // Delete Contact
  const deleteContact = id => {
    dispatch({
      type: DELETE_CONTACT, payload: id
    });
  };

  // Set Current Contact 
  const setCurrent = contact => {
    dispatch({
      type: SET_CURRENT, payload: contact
    });
  };

  // Clear Current Contact
  const clearCurrent = () => {
    dispatch({
      type: CLEAR_CURRENT
    });
  };

  // Update Contact
  const updateContact = contact => {
    dispatch({
      type: UPDATE_CONTACT, payload: contact
    });
  };

  // Filter Contacts
  const filterContacts = text => {
    dispatch({
      type: FILTER_CONTACTS, payload: text
    });
  };


  // Clear Filter
  const clearFilter = () => {
    dispatch({
      type: CLEAR_CURRENT
    });
  };

  // return the Provider so we can wrap our application with this Context
  return (
    <ContactContext.Provider
      // this section here allows us to access these methods from any component
      value={{
        // Anything we want to access from other components and State and 
        // ... actions, we need to put here
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter
      }}>
      { props.children }
    </ContactContext.Provider>
  );
};

export default ContactState;