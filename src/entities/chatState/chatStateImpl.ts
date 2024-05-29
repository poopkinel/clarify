import ChatState from "./chatState";

export default class ChatStateImpl implements ChatState {
    participator1State: string;
    participator2State: string;
    proceedEvent: string;
    
    constructor(participator1State: string, participator2State: string, proceedEvent: string) {
        this.participator1State = participator1State;
        this.participator2State = participator2State;
        this.proceedEvent = proceedEvent;
    }
}