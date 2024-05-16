import ResultModel from "../../dataModels/current/general/resultModel"

export default interface UseCaseToWebBoundary {
    sendRequest(resultModel: ResultModel): Promise<any>;
}