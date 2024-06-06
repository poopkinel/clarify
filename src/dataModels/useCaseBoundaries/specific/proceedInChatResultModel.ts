import ResultModel from "../../useCaseBoundaries/general/resultModel";

type ChatResponseOption = {
    responseMedia: string;
    responseRestrictions: string;
}

type ChatResponseOptions = {
    options: ChatResponseOption[] | null;
}

export default class ProceedInChatResultModel implements ResultModel {
    errors: string[];
    chatNextStateId: string;
    responseOptionsForParticipant: ChatResponseOptions;
    isEndState: boolean = false;

    constructor(errors: string[], chatNextStateId: string, isEndState: boolean = false) {
        this.errors = errors;
        this.chatNextStateId = chatNextStateId;
        this.responseOptionsForParticipant = { options: null };
        this.isEndState = isEndState;
    }

    setResponseOptions(responseOptions: ChatResponseOptions) {
        this.responseOptionsForParticipant = responseOptions;
    }

    setIsEndState(isEndState: boolean) {
        this.isEndState = isEndState;
    }
}