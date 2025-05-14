require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');
const Room = require('./models/Room');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://chat-app-prakharpande04.duckdns.org:3000",
  "http://13.203.198.235:3000"
];

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS (Socket.IO)"));
      }
    },
  }
});

app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS (Express.JS)"));
      }
    },
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// API Routes
app.get('/', (req, res) => {
  res.send('Chat backend is running');
});


app.get('/api/messages', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const messages = await Message.find({ userId: email });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/rooms', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const rooms = await Room.find({ participants: userId });
    res.status(200).json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/rooms/:roomId/messages', async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) return res.status(400).json({ message: "Room ID is required" });

  try {
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// SOCKET.IO EVENTS
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // 🔹 Join Room
  socket.on('join room', async ({ roomId }) => {
    if (!roomId) return;

    if (socket.rooms.has(roomId)) {
      console.log(`⚠️ Socket ${socket.id} already in room ${roomId}`);
      return;
    }

    socket.join(roomId);
    console.log(`✅ Socket ${socket.id} joined room ${roomId}`);

    try {
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
      socket.emit('chat history', messages);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  });

  // 🔹 Create Room
  socket.on('create room', async ({ roomId, userId, participants, roomName = null }) => {
    if (!roomId || !userId || !participants || !participants.length) return;

    try {
      const existingRoom = await Room.findOne({ roomId });
      if (existingRoom) {
        console.log(`Room already exists: ${roomId}`);
        return;
      }

      const newRoom = new Room({
        roomId,
        isGroup: participants.length > 2,
        participants,
        roomName
      });

      const savedRoom = await newRoom.save();
      console.log(`✅ New room created: ${roomId}`);

      // Optionally add creator to the room (redundant if already in participants)
      if (!savedRoom.participants.includes(userId)) {
        savedRoom.participants.push(userId);
        await savedRoom.save();
        console.log(`👤 Added ${userId} to room ${roomId}`);
      }
    } catch (err) {
      console.error('❌ Error creating room:', err);
    }
  });

  // 🔹 Send Message
  socket.on('chat message', async ({ roomId, userId, userName, content }) => {
    if (!roomId || !userId || !content) return;

    try {
      const newMessage = new Message({
        roomId,
        userId,
        userName,
        content,
        timestamp: new Date()
      });

      const savedMessage = await newMessage.save();
      io.to(roomId).emit('chat message', savedMessage);
    } catch (err) {
      console.error('❌ Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// MONGO DB CONNECTION & SERVER START
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });
