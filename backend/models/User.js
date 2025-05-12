const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // e.g., email or UUID
  userName: { type: String, required: true },
  avatarUrl: { type: String }, // optional profile picture
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
