import ChatState from './ChatState';

class WaitingChatState extends ChatState {
  constructor() {
    super("WaitingChat");
  }

  // Specific logic for open chat state
  onEnter() {
    super.onEnter();
    // Additional enter logic for open chat
  }

  renderInput() {
    // Return JSX for text input field
    return (
        <div>Waiting for other user...</div>
    );
  }
}
  
export default WaitingChatState;