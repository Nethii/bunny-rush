const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //hash password

const UserSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true, trim: true },
  password:   { type: String, required: true },
  avatar:     { type: String, default: 'bunny' },
  highScore:  { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 },
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);

/**
 User Model
 Written by: Nethmi Bandusena
 bcrypt password hashing pattern referenced from:
 https://www.npmjs.com/package/bcrypt
 */