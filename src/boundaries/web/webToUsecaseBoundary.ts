import RequestModel from "../../dataModels/useCaseBoundaries/general/requestModel"

export default interface WebToUsecaseBoundary {
    sendStartNewChatRequest(requestModel: RequestModel): Promise<any>;
}