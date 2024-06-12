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
    isEndState: boolean = false;

    constructor(errors: string[], chatNextStateId: string, isEndState: boolean = false) {
        this.errors = errors;
        this.chatNextStateId = chatNextStateId;
        this.responseOptionsForParticipant = { options: [] };
        this.isEndState = isEndState;
    }

    setResponseOptions(responseOptions: ChatResponseOptionsResult) {
        this.responseOptionsForParticipant = responseOptions;
    }

    setIsEndState(isEndState: boolean) {
        this.isEndState = isEndState;
    }
}