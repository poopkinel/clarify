// A use case for a user to view a chat

import { UserGateway } from "../boundaries/persistence/userGateway";
import { ChatGateway } from "../boundaries/persistence/chatGateway";
import { User } from "../entities/userEntity";
import { ChatViewRequestModel } from "../dataModels/chatViewRequestModel";
import { ChatViewResponseModel } from "../dataModels/chatViewResponseModel";
import { ChatEntity } from "../entities/chatEntity";

export class UserViewsAChatUseCase {
    userGateway: UserGateway;
    chatGateway: ChatGateway;

    constructor(userGateway: UserGateway, chatGateway: ChatGateway) {
        this.userGateway = userGateway;
        this.chatGateway = chatGateway;
    }

    async execute(chatViewModel: ChatViewRequestModel) : Promise<ChatViewResponseModel> {
        let user: User | undefined;
        try {
            user = await this.userGateway.getUserById(chatViewModel.userId);
        } catch (error) {
            user = undefined;
        }

        let chatViewResponseModel: ChatViewResponseModel;
        
        if (user === undefined) {
            chatViewResponseModel = {
                chatId: '0',
                chatName: '',
                chatMessages: [],
                error: 'User not found'
            };

            return chatViewResponseModel;
        }

        const chat = await this.chatGateway.getChatById(chatViewModel.chatId);

        chatViewResponseModel = {
            chatId: chat.id,
            chatName: chat.name,
            chatMessages: [],
            error: null
        };

        return chatViewResponseModel;
    }
}