import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import ContactContext from '../../context/contact/contactContext';

const ContactItem = ({ contact }) => {
  const contactContext = useContext(ContactContext);
  const { deleteContact, setCurrent, clearCurrent } = contactContext;

  const { id, name, email, webhook, type } = contact;

  // we have access to the "id" because we're pulling out of "contact" a Line:9
  // ... this was first pulled out of the prop Line:5
  const onDelete = () => {
    deleteContact(id);
    clearCurrent()
  };

  console.log("CONTACT ITEM component----> rendered")

  return (
    <div className='card bg-light'>
      <h3 className="text-primary text-left">
        {name}{' '} 
        <span 
          style={{ float: 'right'}}
          className={
          'badge ' + (type === 'tags' ? 'badge-success' : 'badge-primary')
          }>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </h3>
      <ul className="list">
        {/* if there is an email, do following */}
        {email && (<li>
          <i className="fas fa-envelope"></i> {email}
        </li>)}
        {webhook && (<li>
          <i className="fa fa-link"></i> {webhook}
        </li>)}
      </ul>

      <p>
        <button className="btn btn-dark btn-sm" onClick={() => setCurrent(contact)}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
      </p>
    </div>
  )
}

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired
};

export default ContactItem
