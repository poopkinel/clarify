import ResultModel from "../../useCaseBoundaries/general/resultModel";

export default class RegisterResultModel implements ResultModel {
    success: boolean;
    userId: string;
    error: string;

    constructor(success: boolean, userId: string, error: string = '') {
        this.success = success;
        this.userId = userId;
        this.error = error;
    }
}