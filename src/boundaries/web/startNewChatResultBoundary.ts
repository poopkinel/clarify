import { ChatStartResultModel } from "../../dataModels/chatStartResultModel";

export interface StartNewChatResultBoundary {
    sendStartNewChatResult(chatStartRequestModel: ChatStartResultModel): Promise<ChatStartResultModel>;
}