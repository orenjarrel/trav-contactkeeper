const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Remember: Contact has a user field (which has an object id)
    // ... since we're using the auth.js middleware we have access to 
    // ... the req.user object
    const contacts = await Contact.find({ user: req.user.id })
      .sort({ data: -1 });  // finds most recent contact first
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500)
      .send('Server Error')
    
  }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post('/', [auth, [
    check('name', 'Name is required')
      .not()
      .isEmpty()
    ]
  ], async (req, res) => {
    const errors = validationResult(req);
    // check if errors are empty
    if (!errors.isEmpty()) {
      return res.status(400)
        // send json data; return to us an array of errors in json format
        .json(
          { errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({ 
        name,
        email,
        phone,
        type,
        user: req.user.id
      });

      const contact = await newContact.save();

      // return the contact to the client
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500)
        .send('Server Error');
    }
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build contact object (based on fields that are submitted)
  // initialize an object
  const contactFields = {};
  if(name) contactFields.name = name;
  if(email) contactFields.email = email;
  if(phone) contactFields.phone = phone;
  if(type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    
    if(!contact) return res.status(404).json({ msg: 'Contact not found' });

    // Make sure user owns contact
    if(contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, 
      { $set: contactFields },  // passing in "set" to set the contact fields
      { new: true });  // if the contact doesn't exist, create it!

      res.json(contact);
  } catch (err) {
    console.error(err.message);
      res.status(500)
      .send('Server Error');
  }
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    
    if(!contact) return res.status(404).json({ msg: 'Contact not found' });

    // Make sure user owns contact
    if(contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Contact.findByIdAndRemove(req.params.id);

      res.json({ msg: 'Contact removed'});
  } catch (err) {
    console.error(err.message);
      res.status(500)
      .send('Server Error: Delete');
  }
});



module.exports = router;