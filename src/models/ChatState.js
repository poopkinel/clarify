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
}

module.exports = ChatState;
