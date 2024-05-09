import { ChatStartRequestModel } from "../../dataModels/chatStartRequestModel";
import { StartNewChatRequestBoundary } from "../../boundaries/web/startNewChatRequestBoundary";
import { ChatStartResultModel } from "../../dataModels/chatStartResultModel";

export class WebInPort {
    
    private startNewChatRequestBoundary: StartNewChatRequestBoundary;

    constructor(startNewChatRequestBoundary: StartNewChatRequestBoundary) {
        this.startNewChatRequestBoundary = startNewChatRequestBoundary;
    }

    async startNewChat(webStartNewChatModel: any): Promise<ChatStartResultModel> {
        console.log('webStartNewChatModel', webStartNewChatModel);
        const chatStartRequestModel = new ChatStartRequestModel(webStartNewChatModel.chatName, webStartNewChatModel.userId);
        return this.startNewChatRequestBoundary.sendStartNewChatRequest(chatStartRequestModel);
    }
}