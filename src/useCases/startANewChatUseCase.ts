// A use case for starting a new chat

import { ChatGateway } from "../boundaries/persistence/chatGateway";
import { ChatEntity } from "../entities/chatEntity";
import { ChatStartRequestModel } from "../dataModels/chatStartRequestModel";
import { ChatStartResultModel } from "../dataModels/chatStartResultModel";

import { StartNewChatRequestBoundary } from "../boundaries/web/startNewChatRequestBoundary";
import { StartNewChatResultBoundary } from "../boundaries/web/startNewChatResultBoundary";

export class StartANewChatUseCase implements StartNewChatRequestBoundary {
    private chatGateway: ChatGateway;
    private startNewChatResultBoundary: StartNewChatResultBoundary

    async sendStartNewChatRequest(chatStartRequestModel: ChatStartRequestModel): Promise<ChatStartResultModel> {
        console.log('chatStartRequestModel in sendStartNewChatRequest', chatStartRequestModel)
        const result = await this.execute(chatStartRequestModel);
        return await this.startNewChatResultBoundary.sendStartNewChatResult(result);
    }

    constructor(chatGateway: ChatGateway, startNewChatResultBoundary: StartNewChatResultBoundary) {
        this.chatGateway = chatGateway;
        this.startNewChatResultBoundary = startNewChatResultBoundary;
    }

    validate = (chatStartRequestModel: ChatStartRequestModel) => {
        if (!chatStartRequestModel.chatName || chatStartRequestModel.chatName.length < 1) {
            return false;
        }

        if (!chatStartRequestModel.userId || chatStartRequestModel.userId.length < 1) {
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
                userId: '',
                error: 'Invalid chat start request'
            };
        }

        const chatId = await this.chatGateway.createChat(
            chatStartRequestModel.chatName, 
            chatStartRequestModel.userId, 
            ''
        );

        return {
            chatId: chatId,
            chatName: chatStartRequestModel.chatName,
            userId: chatStartRequestModel.userId,
            error: null
        };
    }
}