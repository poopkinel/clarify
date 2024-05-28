import RequestModel from "../general/requestModel";

type StateInput = {
    stateParticipator1: string;
    stateParticipator2: string;
    event: string;
}

export default class ProceedInChatRequestModel implements RequestModel {
    userId: string;
    chatId: string;
    stateInput: StateInput

    constructor(userId: string, chatId: string, stateInput: StateInput) {
        this.userId = userId;
        this.chatId = chatId;
        this.stateInput = stateInput;
    }
}