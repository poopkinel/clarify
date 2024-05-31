import ChatStateForProceedInChat from "./chatState";

export default class ChatStateImpl implements ChatStateForProceedInChat {
    participator1NextState: string;
    participator2NextState: string;
    proceedEvent: string;

    constructor(participator1State: string, participator2State: string, proceedEvent: string) {
        this.participator1NextState = participator1State;
        this.participator2NextState = participator2State;
        this.proceedEvent = proceedEvent;
    }
}