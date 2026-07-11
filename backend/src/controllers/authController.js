const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });
    res.status(201).json({ user });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};


const login = async (req, res) => {
  // TODO: implement in Phase 2
  res.status(501).json({ message: 'Not implemented' });
};

module.exports = { register, login };
