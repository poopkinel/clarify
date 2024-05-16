import ResultModel from "../../dataModels/current/general/resultModel";

export default interface UsecaseOutBoundary<T extends ResultModel> {
    sendStartNewChatResult(resultModel: T): Promise<any>;
}