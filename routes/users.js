const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', [
  check('name', 'Please add a name')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email')
    .isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({
      min: 6
    })
], 
  async (req, res) => {
  // res.send(req.body);
  const errors = validationResult(req);
  // check if errors are empty
  if (!errors.isEmpty()) {
    return res.status(400)
      // send json data; return to us an array of errors in json format
      .json(
        { errors: errors.array() });
  }

  // destructuring: the req.body should have "name, email, password"
  // ... so we're destructuring to reduce code
  const { name, email, password } = req.body

  try {
    // check to see if there is a user with this email
    let user = await User.findOne({ email });

    if(user) {
      return res.status(400)
        .json({ msg: 'User already exists '});
    }

    // create an instance of the User model
    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    // Save the new user
    await user.save();

    res.send('User saved');

  } catch (err) {
    console.error(err.messeage);
    res.status(500).send('Server Error')
  }
});


module.exports = router;