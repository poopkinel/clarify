import { ChatStartRequestModel } from "../../dataModels/chatStartRequestModel";
import { StartNewChatRequestBoundary } from "../../boundaries/web/startNewChatRequestBoundary";
import ChatStartResultModel from "../../dataModels/chatStartResultModel";
import WebToUsecaseBoundary from "../../boundaries/web/webToUsecaseBoundary";

export class WebInPort {
    
    private startNewChatRequestBoundary: WebToUsecaseBoundary;

    constructor(startNewChatRequestBoundary: WebToUsecaseBoundary) {
        this.startNewChatRequestBoundary = startNewChatRequestBoundary;
    }

    createRequestModel(username: string, chatName: string): ChatStartRequestModel {
        return new ChatStartRequestModel(username, chatName);
    }

    async startNewChat(webStartNewChatRequestModel: any): Promise<ChatStartResultModel> {
        const chatStartRequestModel = new ChatStartRequestModel(webStartNewChatRequestModel.chatName, webStartNewChatRequestModel.userId);
        return this.startNewChatRequestBoundary.sendStartNewChatRequest(chatStartRequestModel);
    }
}