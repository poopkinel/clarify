const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const bodyParser = require('body-parser');

const ChatState = require('./src/models/ChatState');
const ChatEvent = require('./src/models/ChatEvent');
const ChatFlow = require('./src/models/ChatFlow');

// Middlewares
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('public')); // Serve static files from 'public' directory, where your HTML file is located

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Define the route for proceeding with an event
app.post('/proceed', (req, res) => {
  const { event } = req.body;
  // Here you would find the corresponding ChatEvent instance based on the event name
  // For simplicity, we're creating a new event instance directly
  const chatEvent = new ChatEvent(event);
  
  chatFlow.Proceed(chatEvent);
  
  res.json({ message: 'Proceed successful' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// States
const waitingState = new ChatState("Waiting");
const talkingState = new ChatState("Talking");

// Events
const startTalkingEvent = new ChatEvent("StartTalking");

// ChatFlow setup
const chatFlow = new ChatFlow();
chatFlow.addTransition(waitingState, waitingState, startTalkingEvent, talkingState, talkingState);
chatFlow.setCurrentState(waitingState, waitingState);
