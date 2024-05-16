const express = require('express');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');

const { ChatFlow } = require('./entities/chatFlow');
const { events } = require('./config/chatConfig');

const path = require('path');
var distPath = path.join(process.cwd(), './dist/');

const { ApiService } = require(path.join(distPath, './details/web/apiService.js'));
const { StartANewChatUseCase } = require(path.join(distPath, './useCases/startANewChatUseCase'));
const { ChatGatewaySqliteImpl } = require(path.join(distPath, './details/persistence/chatGatewaySqliteImpl'));
const { WebInPortImpl } = require(path.join(distPath, './details/web/webInPortImpl'));

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
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST']
  };
}
app.use(cors(corsOptions));

// Create Socket.io server
const io = new Server(server, {
  cors: corsOptions
});

// Define the port
const PORT = process.env.PORT || 65432;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const apiService = new ApiService();
const startNewChatUseCase = new StartANewChatUseCase(new ChatGatewaySqliteImpl(), apiService);
const webInPort = new WebInPortImpl(startNewChatUseCase);
apiService.setUp(app, webInPort);

// Socket 

app.get('/socket.io/socket.io.js', cors(corsOptions), (req, res) => {
  console.log('socket.io.js requested');
});

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit starting event
  socket.emit('event', 'start');

  socket.on('event', (eventName) => {
    const event = events[eventName];
    console.log('Event received:', event);

    if (!event) {
      console.log('Invalid event');
      return socket.emit('error', 'Invalid event');
    }

    ChatFlow.Proceed(event);
    socket.emit('eventProcessed', 'Event processed');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

