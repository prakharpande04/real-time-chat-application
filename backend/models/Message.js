const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: String, ref: 'User', required: true }, // Reference to User
  userName: { type: String, required: true }, // Assuming you want to store the user's name
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);