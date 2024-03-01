const ChatState = require("./ChatState");

class WaitingChatState extends ChatState {
  constructor() {
    super("WaitingChat");
  }

  // Specific logic for open chat state
  onEnter() {
    super.onEnter();
    // Additional enter logic for open chat
  }
}
  
module.exports = WaitingChatState;