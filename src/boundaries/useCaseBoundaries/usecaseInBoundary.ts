import RequestModel from "../../dataModels/current/general/requestModel"

export default interface UsecaseInBoundary<T extends RequestModel> {
    sendStartNewChatRequest(requestModel: T): Promise<any>;
}