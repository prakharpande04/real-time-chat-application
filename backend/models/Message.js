const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: String, ref: 'User', required: true }, // Reference to User
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);