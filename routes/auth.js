const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // if we send the correct token (and are logged in) 
    // ... the request object will have the logged-in user's ID
    const user = await User.findById(req.user.id)
      .select('-password');  // <-- we don't want to return the password
      res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500)
      .send('Server error');
  }
});


// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post('/', [
  check('email', 'Please include a valid email')
    .isEmail(),
  check('password', 'Password is required')
    .exists()
], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json(
          { errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // if the user (via email) is not valid, send an error
      if(!user) {
        return res.status(400)
          .json({ msg: 'Invalid Credentials' });
      }

      // if there is a user, continue on to check the password
      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res.status(400)
          .json({ msg: 'Invalid Credentials'});
      }

      const payload = {
        user: {
          id: user.id
        }
      }
  
      // to generate a token, we have to sign it
      jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 360000
      }, (err, token) => {
        if(err) throw err;
        res.json({ token });
      })      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
});


module.exports = router;