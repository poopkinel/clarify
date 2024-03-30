const express = require('express');
const cors = require('cors');
const app = express();

const server = require('http').createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);
if (process.env.NODE_ENV === 'production') {
  io.cors = {
    origin: "https://silver-dragon-272374.netlify.app"
  };
} else {
  io.cors = {
    origin: "http://localhost:3000"
  };
}

const PORT = process.env.PORT || 65432;
console.log('PORT:', PORT);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const bodyParser = require('body-parser');
const ChatEvent = require('./models/ChatEvent'); // Import ChatEvent model
const chatFlow = require('./config/chatConfig'); // Import chatFlow

// Enable CORS for all requests
app.use(cors());

// Middlewares
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('public')); // Serve static files from 'public' directory, where your HTML file is located

app.get('/', (req, res) => {
  res.send('Hello World!');
  console.log('before listen to ', server);
  var socket = io.listen(server);
});

app.get('/socket.io/socket.io.js', (req, res) => {
  console.log('socket.io.js requested');
});

// Define the route for getting the chat state
let chatState = 'openChatState'; // This could be dynamically changed based on app's logic
app.get('/api/chatState', (req, res) => {
  res.json({ chatState });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  // Example of emitting chat state
  socket.emit('chatState', chatState);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
})

// Define the route for proceeding with an event
app.post('/proceed', (req, res) => {
  const { event } = req.body;
  // Here you would find the corresponding ChatEvent instance based on the event name
  // For simplicity, we're creating a new event instance directly
  const chatEvent = new ChatEvent(event);
  
  chatFlow.Proceed(chatEvent);
  
  res.json({ message: 'Proceed successful' });
});