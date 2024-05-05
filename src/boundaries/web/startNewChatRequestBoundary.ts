import { ChatStartRequestModel } from "../../dataModels/chatStartRequestModel";
import { ChatStartResultModel } from "../../dataModels/chatStartResultModel";

export interface StartNewChatRequestBoundary {
    sendStartNewChatRequest(chatStartRequestModel: ChatStartRequestModel): Promise<ChatStartResultModel>;
}