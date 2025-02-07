const express = require('express');
// const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');

// const { ChatFlow: ChatFlow_OLD } = require('./entities/chatFlow');
// const { events } = require('./config/chatConfig');

const path = require('path');
var distPath = path.join(process.cwd(), './dist/');

// const { ApiService } = require(path.join(distPath, './details/web/apiService.js'));
// const { StartANewChatUseCase } = require(path.join(distPath, './useCases/v1/startANewChatUseCase'));
// const { ChatGatewaySqliteImpl } = require(path.join(distPath, './details/persistence/v1/chatGatewaySqliteImpl'));
// const { WebInPortImpl } = require(path.join(distPath, './details/web/webInPortImpl'));

const { makePhaseTransition } = require('./chatPhaseManager');
const { phases } = require('./Phase');

const { waiting, openSay } = phases;


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
  
// app.all('*', function(req, res, next) {
//     const origin = req.header('origin').toLowerCase();
//     if (corsOrigins.origins.includes(origin)) {
//         console.log({'origin': origin})
//         res.header("Access-Control-Allow-Origin", origin);
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//         next();
//     }
// });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


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

var currentPhase;

app.post('/start-chat', async (req, res) => {
    const request = {
        chatName: 'New CODE 2 2 ',
        userId: 'NEW CODE'
    };
    currentPhase = ['openSay', 'waiting']
    res.json(request);
});

var p1;
var p2;


app.post('/start-chat-phase', async (req, res) => {
    console.log('in start-chat-phase');
    var phase;
    var role;
    console.log({'req.ip': req.ip})
    
    if (req.header('origin') == "http://localhost:3000") { // TODO: change on production
        phase = openSay;
        p1 = phase;
        role = 'p1';
    } else {
        phase = waiting;
        p2 = phase;
        role = 'p2';
    }
    console.log({'phase': phase, 'role': role})
    res.json({'phase': phase, 'role': role});
});


io.on('connection', (socket) => {
    io.emit('ping');

    socket.on('chat message to server', (msgJson) => {
        const msg = JSON.parse(msgJson);
        const event = msg.chatEvent;
        
        console.log({'currentPhase': [p1, p2], 'chatEvent': event});
        const nextPhases = makePhaseTransition([p1, p2], event).nextPhases
        p1 = nextPhases['p1'];
        p2 = nextPhases['p2'];
        console.log({'on server received msg': msg});
        
        const msgNextPhase = {'id': msg.id, 'text': msg.text, 'sender': msg.sender, 'nextPhases': nextPhases, 'username': msg.username}
        console.log({'msgNextPhase from server': msgNextPhase});
        io.emit('chat message from server', JSON.stringify(msgNextPhase))
        
        console.log({'p2': p2});
        // if (p2 == 'closedUnderstand') {
        //     const newSystemResponse = {'id': msg.id, 'text': `Do you understand what ${msg.username} means?`, 
        //       'sender': 'system', 'username': msg.username};
        //     console.log({'newSystemResponse': newSystemResponse});
        //     io.emit('chat message from server', JSON.stringify(newSystemResponse))
        // }
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

