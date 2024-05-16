import ResultModel from "../../dataModels/current/general/resultModel";

export default interface UsecaseOutBoundary<T extends ResultModel> {
    sendStartNewChatRequest(requestModel: T): Promise<any>;
}