const ChatState = require("./ChatState");

class OpenInputChatState extends ChatState {
  constructor() {
    super("OpenInputChat");
  }

  // Specific logic for open chat state
  onEnter() {
    super.onEnter();
    // Additional enter logic for open chat
  }
}
  
module.exports = OpenInputChatState;