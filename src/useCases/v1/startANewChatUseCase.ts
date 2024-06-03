// A use case for starting a new chat

import ChatGatewayToShareChat from "../../boundaries/gateways/chat/chatGatewayToShareChat";
import { ChatStartRequestModel } from "../../dataModels/v1/chatStartRequestModel";
import ChatStartResultModel from "../../dataModels/v1/chatStartResultModel";

import { StartNewChatRequestBoundary } from "../../boundaries/web/startNewChatRequestBoundary";
import StartNewChatResultBoundary from "../../boundaries/web/startNewChatResultBoundary";

export class StartANewChatUseCase implements StartNewChatRequestBoundary {
    private chatGateway: ChatGatewayToShareChat;
    private startNewChatResultBoundary: StartNewChatResultBoundary

    async sendStartNewChatRequest(chatStartRequestModel: ChatStartRequestModel): Promise<ChatStartResultModel> {
        console.log('chatStartRequestModel in sendStartNewChatRequest', chatStartRequestModel)
        const result = await this.execute(chatStartRequestModel);
        return await this.startNewChatResultBoundary.sendStartNewChatResult(result);
    }

    constructor(chatGateway: ChatGatewayToShareChat, startNewChatResultBoundary: StartNewChatResultBoundary) {
        this.chatGateway = chatGateway;
        this.startNewChatResultBoundary = startNewChatResultBoundary;
    }

    validate = (chatStartRequestModel: ChatStartRequestModel) => {
        if (!chatStartRequestModel.chatName || chatStartRequestModel.chatName.length < 1) {
            return false;
        }

        if (!chatStartRequestModel.username || chatStartRequestModel.username.length < 1) {
            return false;
        }

        return true;
    }

    async execute(chatStartRequestModel: ChatStartRequestModel): Promise<ChatStartResultModel> {
        console.log('chatStartRequestModel', chatStartRequestModel)
        const validated = this.validate(chatStartRequestModel);

        if (!validated) {
            return {
                chatId: '',
                chatName: '',
                username: '',
                error: 'Invalid chat start request'
            };
        }

        // const chatId = await this.chatGateway.createChat(
        //     chatStartRequestModel.chatName, 
        //     chatStartRequestModel.username, 
        //     ''
        // );
        const chatId = '1';

        return {
            chatId: chatId,
            chatName: chatStartRequestModel.chatName,
            username: chatStartRequestModel.username,
            error: ""
        };
    }
}