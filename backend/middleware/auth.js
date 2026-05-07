const jwt = require('jsonwebtoken');
const config = require('../config/db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // if there isn't any token
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // if the token is no longer valid
    }
    req.user = user;
    next(); // move on to the next middleware
  });
}

module.exports = { authenticateToken };