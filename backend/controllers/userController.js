const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = await User.create(email, password);
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await User.validatePassword(user, password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.verifyToken = (req, res) => {
  // The token is already verified by the auth middleware
  // If we reach this point, the token is valid
  res.status(200).json({ message: 'Token is valid' });
};

exports.logout = (req, res) => {
  // In a real-world scenario, you might want to blacklist the token
  // For now, we'll just send a success response
  res.status(200).json({ message: 'Logout successful' });
};
