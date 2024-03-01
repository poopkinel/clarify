import ChatState from './ChatState';

class OpenInputChatState extends ChatState {
  constructor() {
    super("OpenInputChat");
  }

  // Specific logic for open chat state
  onEnter() {
    super.onEnter();
    // Additional enter logic for open chat
  }

  renderInput() {
    // Return JSX for text input field
    return (
      <input type="text" placeholder="Type a message..." />
    );
  }
}
  
export default OpenInputChatState;