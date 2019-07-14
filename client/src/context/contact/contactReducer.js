import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  CONTACT_ERROR,
  FILTER_CONTACTS,
  CLEAR_FILTER
} from '../types';

export default (state, action) => {
  // this is how things are passed down to State
  switch(action.type) {
    case ADD_CONTACT:
      let myAddObject = {
        // first return the current state
        ...state,
        contacts: [...state.contacts, action.payload] // this updates the state
      };
      console.log("ADD_CONTACT_CASE----> entered", myAddObject)
      return myAddObject
    case UPDATE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map(contact => contact.id === action.payload.id ?
        action.payload : contact)
      };
    case DELETE_CONTACT:
      let myobject = {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload)
      };
      return myobject;
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload
      }
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null
      }
    case CONTACT_ERROR:
      return {
        ...state,
        error: action.payload 
      };
    case FILTER_CONTACTS:
      return {
        ...state,
        filtered: state.contacts.filter(contact => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return contact.name.match(regex) || contact.email.match(regex);
        })
      };
    case CLEAR_FILTER:
        return {
          ...state,
          filtered: null
        }
    default: 
      return state;
  }
}