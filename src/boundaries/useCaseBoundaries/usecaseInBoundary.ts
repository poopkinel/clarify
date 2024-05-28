import RequestModel from "../../dataModels/useCaseBoundaries/general/requestModel"

export default interface UsecaseInBoundary<T extends RequestModel> {
    sendRequestModel(requestModel: T): Promise<any>;
}