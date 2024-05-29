import RequestModel from "../general/requestModel";

type StateInput = {
    participator1State: string;
    participator2State: string;
    proceedEvent: string;
}

export default class ProceedInChatRequestModel implements RequestModel {
    userId: string;
    chatId: string;
    stateInput: StateInput;

    constructor(userId: string, chatId: string, stateInput: StateInput) {
        this.userId = userId;
        this.chatId = chatId;
        this.stateInput = stateInput;
    }

    static fromJson(json: any): ProceedInChatRequestModel {
        return new ProceedInChatRequestModel(json.userId, json.chatId, json.stateInput);
    }
}