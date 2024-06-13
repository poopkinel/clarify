import ResultModel from "../../useCaseBoundaries/general/resultModel";

export type ChatResponseOptionResult = {
    responseMedia: string;
    responseRestrictions: string;
}

export type ChatResponseOptionsResult = {
    options: ChatResponseOptionResult[] | null;
}

export class ProceedInChatResultModel implements ResultModel {
    errors: string[];
    chatNextStateId: string;
    responseOptionsForParticipant: ChatResponseOptionsResult;
    isChatEnded: boolean = false;

    constructor(errors: string[], chatNextStateId: string, isChatEnded: boolean = false) {
        this.errors = errors;
        this.chatNextStateId = chatNextStateId;
        this.responseOptionsForParticipant = { options: [] };
        this.isChatEnded = isChatEnded;
    }

    setResponseOptions(responseOptions: ChatResponseOptionsResult) {
        this.responseOptionsForParticipant = responseOptions;
    }

    setisChatEnded(isChatEnded: boolean) {
        this.isChatEnded = isChatEnded;
    }
}