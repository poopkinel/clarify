class ChatFlow {
    constructor() {
        this.stateTransitions = new Map(); // Map of state transitions
        this.currentState = { participant1: null, participant2: null }; // Current state of participants
    }

    addTransition(state1, state2, event, newState1, newState2) {
        const key = JSON.stringify({ state1: state1.name, state2: state2.name, event: event.name });
        this.stateTransitions.set(key, { newState1, newState2 });
    }

    Proceed(event) {
        const currentStateKey = JSON.stringify({
            state1: this.currentState.participant1.name,
            state2: this.currentState.participant2.name,
            event: event.name
        });

        const transition = this.stateTransitions.get(currentStateKey);
        if (transition) {
            this.currentState.participant1.OnExit();
            this.currentState.participant2.OnExit();

            this.currentState.participant1 = transition.newState1;
            this.currentState.participant2 = transition.newState2;

            this.currentState.participant1.OnEnter();
            this.currentState.participant2.OnEnter();
        } else {
            console.log("No transition found for this event.");
        }
    }

    setCurrentState(state1, state2) {
        this.currentState.participant1 = state1;
        this.currentState.participant2 = state2;
        state1.OnEnter();
        state2.OnEnter();
    }
}


module.exports = ChatFlow;
