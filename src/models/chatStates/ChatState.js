class ChatState {
    constructor(name) {
        this.name = name;
    }

    OnEnter() {
        console.log(`${this.name} state entered.`);
    }

    OnExit() {
        console.log(`${this.name} state exited.`);
    }
    
    handleInput(input) {
        console.log(`Input received in ${this.name} state: ${input}`);
        // Handle input specific to the state
    }
}

module.exports = ChatState;
