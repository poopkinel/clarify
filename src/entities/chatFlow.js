class ChatFlow_OLD {
    constructor() {
        this.stateTransitions = new Map(); // Map of state transitions
        this.currentState = { Participator1: null, Participator2: null }; // Current state of Participators
    }

    addTransition(state1, state2, event, newState1, newState2) {
        const key = JSON.stringify({ state1: state1.name, state2: state2.name, event: event.name });
        this.stateTransitions.set(key, { newState1, newState2 });
    }

    Proceed(event) {
        const currentStateKey = JSON.stringify({
            state1: this.currentState.Participator1.name,
            state2: this.currentState.Participator2.name,
            event: event.name
        });

        const transition = this.stateTransitions.get(currentStateKey);
        if (transition) {
            this.currentState.Participator1.OnExit();
            this.currentState.Participator2.OnExit();

            this.currentState.Participator1 = transition.newState1;
            this.currentState.Participator2 = transition.newState2;

            this.currentState.Participator1.OnEnter();
            this.currentState.Participator2.OnEnter();
        } else {
            console.log("No transition found for this event.");
        }
    }

    setCurrentState(state1, state2) {
        this.currentState.Participator1 = state1;
        this.currentState.Participator2 = state2;
        state1.OnEnter();
        state2.OnEnter();
    }
}


module.exports = ChatFlow_OLD;
