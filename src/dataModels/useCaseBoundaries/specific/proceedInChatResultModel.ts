import ResultModel from "../../useCaseBoundaries/general/resultModel";

export default class ProceedInChatResultModel implements ResultModel {
    errors: string[];
    chatEndStateId: string;
    responseOptions: string[];

    constructor(errors: string[], chatEndStateId: string) {
        this.errors = errors;
        this.chatEndStateId = chatEndStateId;
        this.responseOptions = [];
    }

    setResponseOptions(responseOptions: string[]) {
        this.responseOptions = responseOptions;
    }
}