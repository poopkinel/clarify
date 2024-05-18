import RequestModel from "../../dataModels/current/general/requestModel"

export default interface UsecaseInBoundary<T extends RequestModel> {
    sendRequestModel(requestModel: T): Promise<any>;
}