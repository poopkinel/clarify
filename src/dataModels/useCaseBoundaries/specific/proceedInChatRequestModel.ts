import RequestModel from "../general/requestModel";

type StateInput = {
    // proceedEvent: string;
    response: {
        responseMedia: string;
        responseContent: string;
        eventValidationResult: {
            success: boolean;
            error: string;
            event: string;
        }
    }
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