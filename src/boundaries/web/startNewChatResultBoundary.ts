import ChatStartResultModel from "../../dataModels/v1/chatStartResultModel";

export default interface StartNewChatResultBoundary {
    sendStartNewChatResult(chatStartRequestModel: ChatStartResultModel): Promise<any>;
}