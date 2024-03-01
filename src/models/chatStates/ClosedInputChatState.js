const ChatState = require("./ChatState");

class ClosedInputChatState extends ChatState {
  constructor(options) {
    super("ClosedInputChat");
    this.options = options; // Assuming options is an array of button labels
  }

  onEnter() {
    super.onEnter();
    // Additional enter logic for closed chat
  }
}

module.exports = ClosedInputChatState;
