import ChatResponseOptions from "../../../entities/responseOption/chatResponseOptions";
import ResultModel from "../../useCaseBoundaries/general/resultModel";

export default class ProceedInChatResultModel implements ResultModel {
    errors: string[];
    chatNextStateId: string;
    responseOptions: ChatResponseOptions;

    constructor(errors: string[], chatNextStateId: string) {
        this.errors = errors;
        this.chatNextStateId = chatNextStateId;
        this.responseOptions = { options: null };
    }

    setResponseOptions(responseOptions: ChatResponseOptions) {
        this.responseOptions = responseOptions;
    }
}