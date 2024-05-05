import { StartNewChatResultBoundary } from "../../boundaries/web/startNewChatResultBoundary";
import { ChatStartResultModel } from "../../dataModels/chatStartResultModel";

export class ApiService implements StartNewChatResultBoundary {
    async sendStartNewChatResult(chatStartRequestModel: ChatStartResultModel): Promise<any> {
        return {
            chatId: chatStartRequestModel.chatId,
            chatName: chatStartRequestModel.chatName,
            userId: chatStartRequestModel.userId,
            error: chatStartRequestModel.error
        }
    }
}