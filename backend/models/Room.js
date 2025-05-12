const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, // e.g., UUID or combined user IDs
  isGroup: { type: Boolean, default: false },
  participants: [{ type: String, required: true }], // array of userIds
  roomName: { type: String }, // for group chats
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
