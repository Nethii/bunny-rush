const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {   //creates user and returns JWT
  try {
    const { username, password } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already taken' });

    const user = await User.create({ username, password });
    const token = signToken(user._id);
    res.status(201).json({ token, username: user.username, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {   //verifies password and returns JWT
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid username or password' });

    const token = signToken(user._id);
    res.json({ token, username: user.username, avatar: user.avatar, highScore: user.highScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;