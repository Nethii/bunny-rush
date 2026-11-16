const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];  //reads JWT authorization header

  if (!token) {
    return res.status(401).json({ message: 'Not authorised, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  //verifies it
    req.user = await User.findById(decoded.id).select('-password'); // attaches user to req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' });
  }
};

module.exports = protect;

/*
 JWT Authentication Middleware
 Written by: Nethmi Bandusena
 JWT verification pattern referenced from:
 https://www.npmjs.com/package/jsonwebtoken
 */