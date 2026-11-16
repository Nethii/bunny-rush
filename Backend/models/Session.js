const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score:     { type: Number, default: 0 },
  scene:     { type: Number, default: 1 },
  lives:     { type: Number, default: 3 },
  combo:     { type: Number, default: 0 },
  currentCarrots: { type: Number, default: 0 },
currentRound:   { type: String, default: 'hearts' },
  powerUps: {
    mushroom: { type: Number, default: 1 },
    star:     { type: Number, default: 1 },
    portal:   { type: Number, default: 1 },
  },
  currentSolution: { type: Number, default: null },
  completed:       { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);

