const ChatState = require("./ChatState");

class OpenInputChatState extends ChatState {
  constructor() {
    super("OpenInputChat");
  }

  // Specific logic for open chat state
  onEnter() {
    super.onEnter();
    console.log("Open chat state entered.");
  }
}
  
module.exports = OpenInputChatState;