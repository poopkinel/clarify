import ResultModel from "../../dataModels/current/general/resultModel";

export default interface UsecaseOutBoundary<T extends ResultModel> {
    sendResultModel(resultModel: T): Promise<any>;
}