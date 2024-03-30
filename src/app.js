const express = require('express');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');

const chatFlow = require('./models/ChatFlow');
const { events } = require('./config/chatConfig');

// CORS settings
var corsOptions;
if (process.env.NODE_ENV === 'production') {
  console.log('using cors production settings');
  corsOptions = {
    origin: 'https://silver-dragon-272374.netlify.app'
  };
} else {
  console.log('using cors development settings');
  corsOptions = {
    origin: 'http://localhost:3000'
  };
}

// Create Socket.io server
const io = new Server(server, {
  cors: corsOptions
});

// Define the port
const PORT = process.env.PORT || 65432;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Server up');
});

app.get('/socket.io/socket.io.js', cors(corsOptions), (req, res) => {
  console.log('socket.io.js requested');
});

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('event', (eventName) => {
    const event = events[eventName];

    if (!event) {
      return socket.emit('error', 'Invalid event');
    }

    chatFlow.Proceed(event);
    socket.emit('eventProcessed', 'Event processed');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

