const ChatState = require('./src/models/ChatState');
const ChatEvent = require('./src/models/ChatEvent');
const ChatFlow = require('./src/models/ChatFlow');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
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

// Simulate an event to change the state
chatFlow.Proceed(startTalkingEvent);
