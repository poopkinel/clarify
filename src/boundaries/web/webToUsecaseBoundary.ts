import RequestModel from "../../dataModels/requestModel"

export default interface WebToUsecaseBoundary {
    sendStartNewChatRequest(requestModel: RequestModel): Promise<any>;
}