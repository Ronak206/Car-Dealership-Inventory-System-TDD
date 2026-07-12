const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Pass
};

const requireAdmin = (req, res, next) => {
  // Pass
};

module.exports = { verifyToken, requireAdmin };
