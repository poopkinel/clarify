const express = require('express');
// const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');


const path = require('path');
// var distPath = path.join(process.cwd(), './dist/');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./sqlite3.db', (err) => {});


const { makePhaseTransition } = require('./chatPhaseManager');
const { phases } = require('./Phase');

const { waiting, openSay } = phases;

const corsOrigins = {
    origins: ["http://localhost:3000","http://127.2.2.2:3000"],
    default: "http://localhost:3000"
  } 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


// Create Socket.io server
const io = new Server(server, {
    cors: corsOrigins.origins
});

app.use(express.json())

// Define the port
const PORT = process.env.PORT || 65432;
server.listen(PORT, () => {
    console.log(`New Server is running on port ${PORT}`);
});

var user1;
var user2;
var p1;
var p2;

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

        const tryMakePhaseTransition = makePhaseTransition([p1, p2], event);
        if (tryMakePhaseTransition === 'Error') {
            io.emit('chat message from server', JSON.stringify({'Error': 'Phase Transition Error'}));
            return;
        } 

        const nextPhases = tryMakePhaseTransition.nextPhases

        console.log({'next phases': [nextPhases['p1'].key, nextPhases['p2'].key]});
        p1 = nextPhases['p1'];
        p2 = nextPhases['p2'];
        console.log({'on server received msg': msg});
        
        const msgNextPhase = {'id': msg.id, 'text': msg.text, 'sender': msg.sender, 'nextPhases': nextPhases, 'username': msg.username}
        console.log({'msgNextPhase from server': msgNextPhase});
        io.emit('chat message from server', JSON.stringify(msgNextPhase))
        
        console.log({'p2': p2});
    });
});

function insert(sql, params) {
    return new Promise((resolve, reject) => {
      return db.run(sql, params, function (err, res) {
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
    const result = await insert(sql, []);
    return result; 
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