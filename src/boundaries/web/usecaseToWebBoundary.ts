import ResultModel from "../../dataModels/resultModel"

export default interface UseCaseToWebBoundary {
    sendRequest(resultModel: ResultModel): Promise<any>;
}