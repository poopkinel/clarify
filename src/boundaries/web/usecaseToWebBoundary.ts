import ResultModel from "../../dataModels/useCaseBoundaries/general/resultModel"

export default interface UseCaseToWebBoundary {
    sendRequest(resultModel: ResultModel): Promise<any>;
}