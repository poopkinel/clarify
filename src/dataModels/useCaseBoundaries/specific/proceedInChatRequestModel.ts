import RequestModel from "../general/requestModel";

type ResponseInput = {
    responseMedia: string;
    responseContent: string;
}

type ChatStateInput = {
    response: ResponseInput;
}

export default class ProceedInChatRequestModel implements RequestModel {
    userId: string;
    chatId: string;
    stateInput: ChatStateInput;

    constructor(userId: string, chatId: string, stateInput: ChatStateInput) {
        this.userId = userId;
        this.chatId = chatId;
        this.stateInput = stateInput;
    }

    static fromJson(json: any): ProceedInChatRequestModel {
        return new ProceedInChatRequestModel(json.userId, json.chatId, json.stateInput);
    }
}