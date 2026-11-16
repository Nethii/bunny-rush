const router = require('express').Router();
const protect = require('../middleware/protect');
const Session = require('../models/Session');
const User = require('../models/User');
const { fetchPuzzle } = require('../services/heartApi');

router.post('/start', protect, async (req, res) => {  //creates session
  try {
    await Session.deleteMany({ user: req.user._id, completed: false });
    const session = await Session.create({ user: req.user._id });
    res.status(201).json({
      sessionId: session._id,
      lives: session.lives,
      score: session.score,
      scene: session.scene,
      powerUps: session.powerUps,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/puzzle', protect, async (req, res) => { //fetches from API and save solution
  try {
    const puzzle = await fetchPuzzle();
    await Session.findOneAndUpdate(
      { user: req.user._id, completed: false },
      { $set: { currentSolution: puzzle.solution } },
      { upsert: true, new: true }
    );
    res.json({ imageUrl: puzzle.imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/answer', protect, async (req, res) => { //checks answer
  try {
    const { answer, scene } = req.body;
    const session = await Session.findOne({ user: req.user._id, completed: false });
    if (!session) return res.status(404).json({ message: 'No active session found' });

    const correct = answer === session.currentSolution;

    if (correct) {
      session.score += calculatePoints(session.combo, scene);
      session.combo += 1;
      const streakBonus = session.combo >= 4 ? 15 : 0;
      session.score += streakBonus;
      session.scene = Math.min(session.scene + 1, 10);
      if (scene >= 10) session.completed = true;

      await session.save();
      if (session.completed) {
        await User.findByIdAndUpdate(req.user._id, {
          $max: { highScore: session.score },
          $inc: { totalGames: 1 },
        });
      }
      return res.json({
        correct: true, score: session.score, lives: session.lives,
        combo: session.combo, scene: session.scene,
        gameOver: false, won: session.completed, streakBonus,
      });
    } else {
      session.lives -= 1;
      session.combo  = 0;
      if (session.lives <= 0) {
        session.completed = true;
        await User.findByIdAndUpdate(req.user._id, {
          $max: { highScore: session.score },
          $inc: { totalGames: 1 },
        });
      }
      await session.save();
      return res.json({
        correct: false, score: session.score, lives: session.lives,
        combo: session.combo, scene: session.scene,
        gameOver: session.lives <= 0, won: false, streakBonus: 0,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/powerup', protect, async (req, res) => {  //handles powerups
  try {
    const { type } = req.body;
    const session = await Session.findOne({ user: req.user._id, completed: false });
    if (!session || session.powerUps[type] <= 0)
      return res.status(400).json({ message: 'No power-up available' });

    session.powerUps[type] -= 1;
    const result = { type, remaining: session.powerUps[type] };

    if (type === 'star') result.solution = session.currentSolution;
    if (type === 'portal') {
      session.scene = Math.min(session.scene + 1, 10);
      session.score = Math.max(0, session.score - 5);
    }

    await session.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function calculatePoints(combo, scene) {
  const base = 10;
  const comboMultiplier = 1 + combo * 0.1;
  const sceneMultiplier = 1 + scene * 0.05;
  return Math.round(base * comboMultiplier * sceneMultiplier);
}

module.exports = router;