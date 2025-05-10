require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors({
  origin: "https://real-time-chat-application-4vj8.vercel.app/", // Replace with your frontend's URL
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('join room', async ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    try {
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 }); // Fetch messages for the room
      socket.emit('chat history', messages); // Send chat history to the client
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  });

  // Handle incoming chat messages
  socket.on('chat message', async ({ roomId, userId, userName, content }) => {
    try {
      const savedMessage = await new Message({ roomId, userId, userName, content }).save(); // Save with roomId
      io.to(roomId).emit('chat message', savedMessage); // Emit the message to the specific room
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });
