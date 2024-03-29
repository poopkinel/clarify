const ChatFlow = require('../models/ChatFlow');
const ChatEvent = require('../models/ChatEvent');
const ChatState = require('../models/chatStates/ChatState');
const OpenInputChatState = require('../models/chatStates/OpenInputChatState');
const ClosedInputChatState = require('../models/chatStates/ClosedInputChatState');
const WaitingChatState = require('../models/chatStates/WaitingChatState');

// Define States
const waitingStatePar1 = new WaitingChatState();
const waitingStatePar2 = new WaitingChatState();
const talkingStatePar1 = new OpenInputChatState("Talking");
const talkingStatePar2 = new OpenInputChatState("Talking");

// Define Events
const messageSentEvent = new ChatEvent("MessageSent");

// Instantiate ChatFlow
const chatFlow = new ChatFlow();

// Add State Transitions
chatFlow.addTransition(waitingStatePar1, talkingStatePar2, messageSentEvent, talkingStatePar1, waitingStatePar2);
chatFlow.addTransition(talkingStatePar1, waitingStatePar2, messageSentEvent, waitingStatePar1, talkingStatePar2);

// Expose only the chatFlow instance
module.exports = chatFlow;
