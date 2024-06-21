import ChatStateForProceedInChat from "../../../entities/chatState/chatState";

export default class ChatFlowGetNextStateResult {
    success: boolean;
    error: string;
    nextState: ChatStateForProceedInChat;
    proceedEvent: string;

    constructor(
        success: boolean,
        error: string,
        nextState: ChatStateForProceedInChat,
        proceedEvent: string
    ) {
        this.success = success;
        this.error = error;
        this.nextState = nextState;
        this.proceedEvent = proceedEvent;
    }
}