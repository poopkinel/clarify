const express = require('express');
// const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');

// const { ChatFlow: ChatFlow_OLD } = require('./entities/chatFlow');
// const { events } = require('./config/chatConfig');

const path = require('path');
var distPath = path.join(process.cwd(), './dist/');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./sqlite3.db', (err) => {});


// const { ApiService } = require(path.join(distPath, './details/web/apiService.js'));
// const { StartANewChatUseCase } = require(path.join(distPath, './useCases/v1/startANewChatUseCase'));
// const { ChatGatewaySqliteImpl } = require(path.join(distPath, './details/persistence/v1/chatGatewaySqliteImpl'));
// const { WebInPortImpl } = require(path.join(distPath, './details/web/webInPortImpl'));

const { makePhaseTransition } = require('./chatPhaseManager');
const { phases } = require('./Phase');
const { unwatchFile } = require('fs');

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

var user1;
var user2;
var p1;
var p2;

var pCounter = 0;

app.post('/start-chat-phase', async (req, res) => {
    console.log('in start-chat-phase');
    var phase;
    var role;
    console.log({'req.body': req.body})
    
    const incomingUser = req.body.userId;
    if (user1 === undefined) {
        user1 = incomingUser;
    } else if (user2 === undefined && incomingUser !== user1) {
        user2 = incomingUser;
    }

    // pCounter++;
    // if (pCounter > 2) {
    //     p1 = null;
    //     p2 = null;
    //     pCounter = 1;
    // }

    // if (req.header('origin') == "http://localhost:3000") { // TODO: change on production
    if (user1 === incomingUser) {
        phase = openSay;
        p1 = phase;
        role = 'p1';
    } else if (user2 === incomingUser) {
        phase = waiting;
        p2 = phase;
        role = 'p2';
    } else {
        console.log({'user1': user1 === undefined, 'user2': user2 === undefined});
        return;
    }
    console.log({'phase': phase, 'role': role})
    res.json({'phase': phase, 'role': role});
});


io.on('connection', (socket) => {
    io.emit('ping');

    socket.on('chat message to server', async (msgJson) => {
        const id = await createChat('TestName', 'TestUser1', 'TestUser2');

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

function insert(sql, params) {
    return new Promise((resolve, reject) => {          // return new Promise here <---
      return db.run(sql, params, function (err, res) { // .run <----
        if (err) {
          console.error("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        return resolve(this.lastID);
      });
    });
}

app.get('/test-db-create-chat', async (req, res) => {
    const row = await createChat('TestName', 'TestUser1', 'TestUser2');
    console.log({'row': row});
    res.json({'row': row});
});

app.get('/test-db-get-all-chats', async (req, res) => {
    const rows = await getAllChats();
    console.log({'rows': rows });
    res.json({'rows': rows });
});

const createChat = async (chatName, user1, user2) => {
    const chatsTableName = 'chats'
    const sql = `INSERT INTO ${chatsTableName} (name, user1, user2) VALUES ('${chatName}', '${user1}', '${user2}') RETURNING *;`;
    // console.log(sql);

    var chatId = "";

    // var result;

    const result = await insert(sql, []);
    return result; 

    // const { err, result } = await db.get(sql);
    
    // db.get(sql, (err, row) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log({ 'result': row });
    //         return row;
    //     }
    // });

    // db.run(sql, function(err) {
    //     if (err) {
    //         console.log(err.message);
    //     }
    //     // get the last insert id
    //     console.log(`A row has been inserted with rowid ${this.lastID}`);
    //     return this.lastID;
    // });

    // const row = await db.get(sql);
    // const result = typeof row !== 'undefined' && row.recsCount > 0;

    // return row;
    
    // return new Promise((resolve, reject) => {
    //     db.run(sql, (err, row) => {
    //      if (err) reject(err);
    //      resolve(row);
    //     });
    //    });

    // // chatId = out('result')('id');

    // // console.log('Chat returned', chatId);
    // return chatId;    
}

const getAllChats = async () => {
    const sql = 'SELECT * FROM chats';
    
    return new Promise((resolve, reject) => {
        db.all(sql, [], (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
};


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

