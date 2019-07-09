// Middleware: a function that has access to the request and response cylcle/object
// everytime we hit an endpoint, we can fire this off to check for the JWT token
// NOTE: this will only pertain to "protected" routes

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token'); 

  // Check if not token (not exists)
  if(!token) {
    return res.status(401)
      .json({ msg: 'auth:middleware - No token, authorization denied' });
  }

  // if token exits, verify it

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
    console.log('made it!', req.user)
  } catch (err) {
    console.log("didn't make it!")
    res.status(401)
      .json({ msg: 'Token is not valid' });
  }
}