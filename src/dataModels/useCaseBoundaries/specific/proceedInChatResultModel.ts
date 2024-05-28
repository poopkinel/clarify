import ResultModel from "../../useCaseBoundaries/general/resultModel";

export default class ProceedInChatResultModel implements ResultModel {
    errors: string[];

    constructor(errors: string[]) {
        this.errors = errors;
    }
}