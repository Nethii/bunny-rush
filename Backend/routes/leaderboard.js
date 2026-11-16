const router = require('express').Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const top = await User.find({}, 'username highScore totalGames avatar')
      .sort({ highScore: -1 }) //grt top 10 users sorted by highscore
      .limit(10);
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;