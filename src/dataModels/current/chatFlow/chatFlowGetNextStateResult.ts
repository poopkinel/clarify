import ChatStateForProceedInChat from "../../../entities/chatState/chatState";

export default class ChatFlowGetNextStateResult {
    success: boolean;
    error: string;
    nextState: ChatStateForProceedInChat;

    constructor(
        success: boolean,
        error: string,
        nextState: ChatStateForProceedInChat
    ) {
        this.success = success;
        this.error = error;
        this.nextState = nextState;
    }
}