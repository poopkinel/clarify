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

    constructor(errors: string[], chatNextStateId: string) {
        this.errors = errors;
        this.chatNextStateId = chatNextStateId;
        this.responseOptionsForParticipant = { options: null };
    }

    setResponseOptions(responseOptions: ChatResponseOptions) {
        this.responseOptionsForParticipant = responseOptions;
    }
}