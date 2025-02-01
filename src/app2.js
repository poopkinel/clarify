const express = require('express');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');

const { ChatFlow: ChatFlow_OLD } = require('./entities/chatFlow');
const { events } = require('./config/chatConfig');

const path = require('path');
var distPath = path.join(process.cwd(), './dist/');

const { ApiService } = require(path.join(distPath, './details/web/apiService.js'));
const { StartANewChatUseCase } = require(path.join(distPath, './useCases/v1/startANewChatUseCase'));
const { ChatGatewaySqliteImpl } = require(path.join(distPath, './details/persistence/v1/chatGatewaySqliteImpl'));
const { WebInPortImpl } = require(path.join(distPath, './details/web/webInPortImpl'));

const { makePhaseTransition } = require('./chatPhaseManager');


// CORS settings
// var corsOptions;
// if (process.env.NODE_ENV === 'production') {
//   console.log('using cors production settings');
//   corsOptions = {
//     origin: 'https://silver-dragon-272374.netlify.app'
//   };
// } else {
//   console.log('using cors development settings');
//   corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true,
//     methods: ('GET', 'POST')
//   };
//   corsOptions2 = {
//     origin: 'http://127.2.2.2:3000',
//     credentials: true,
//     methods: ('GET', 'POST')
//   };
// }

const corsOrigins = {
    origins: ["http://localhost:3000","http://127.2.2.2:3000"],
    default: "http://localhost:3000"
  } 
  
app.all('*', function(req, res, next) {
    const origin = req.header('origin').toLowerCase();
    if (corsOrigins.origins.includes(origin)) {
        console.log({'origin': origin})
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
});

// app.use(cors(corsOptions2));
// app.use(cors(corsOptions2));

// Create Socket.io server
const io = new Server(server, {
//   cors: corsOptions
    cors: corsOrigins.origins
});

app.use(express.json())

// Define the port
const PORT = process.env.PORT || 65432;
server.listen(PORT, () => {
  console.log(`New Server is running on port ${PORT}`);
});

app.post('/start-chat', async (req, res) => {
    const request = {
        chatName: 'New CODE 2 2 ',
        userId: 'NEW CODE'
    };
    // const resultModel = await this.webInPort.startNewChat(request);
    // const response = await this.sendStartNewChatResult(resultModel);
    res.json(request);
});

app.post('/next-phase', (req, res) => {
  console.log('request body:');
  console.log(req.body);
  const current = (req.body.current[0], req.body.current[1]);
  const event = req.body.event;
  const nextPhase = makePhaseTransition(current, event).nextPhase
  console.log(nextPhase);
  res.json({
    'next-phase': nextPhase
  });
})


io.on('connection', (socket) => {
    io.emit('hello');

    socket.on('chat message', (msg) => {
        console.log({'received msg': msg});
        io.emit('chat message', msg)
    });
});

// const apiService = new ApiService();
// const startNewChatUseCase = new StartANewChatUseCase(new ChatGatewaySqliteImpl(), apiService);
// const webInPort = new WebInPortImpl(startNewChatUseCase);
// apiService.setUp(app, webInPort);

// Socket 

// app.get('/socket.io/socket.io.js', cors(corsOptions), (req, res) => {
//   console.log('socket.io.js requested');
// });

// // Socket.io
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Emit starting event
//   socket.emit('event', 'start');

//   socket.on('event', (eventName) => {
//     const event = events(eventName);
//     console.log('Event received:', event);

//     if (!event) {
//       console.log('Invalid event');
//       return socket.emit('error', 'Invalid event');
//     }

//     ChatFlow_OLD.Proceed(event);
//     socket.emit('eventProcessed', 'Event processed');
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

