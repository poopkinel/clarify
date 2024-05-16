import RequestModel from "../../dataModels/current/general/requestModel"

export default interface WebToUsecaseBoundary {
    sendStartNewChatRequest(requestModel: RequestModel): Promise<any>;
}