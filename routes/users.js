const express = require('express');
const router = express.Router();
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
], (req, res) => {
  // res.send(req.body);
  const errors = validationResult(req);
  // check if errors are empty
  if (!errors.isEmpty()) {
    return res.status(400)
      // send json data; gives us an array of errors 
      .json(
        { errors: errors.array() });
  }

  res.send('passed');
});


module.exports = router;