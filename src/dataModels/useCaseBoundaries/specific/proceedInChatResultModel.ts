import ResultModel from "../../useCaseBoundaries/general/resultModel";

export default class ProceedInChatResultModel implements ResultModel {
    errors: string[];
    chatEndStateId: string;

    constructor(errors: string[], chatEndStateId: string) {
        this.errors = errors;
        this.chatEndStateId = chatEndStateId;
    }
}