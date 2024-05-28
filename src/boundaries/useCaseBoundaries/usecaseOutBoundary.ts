import ResultModel from "../../dataModels/useCaseBoundaries/general/resultModel";

export default interface UsecaseOutBoundary<T extends ResultModel> {
    sendResultModel(resultModel: T): Promise<any>;
}