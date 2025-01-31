// A use case for a user to view a chat

import { UserGateway } from "../../boundaries/gateways/userGateway";
import ChatGatewayToShareChat from "../../boundaries/gateways/chat/chatGatewayToShareChat";
import { UserEntity } from "../../entities/userEntity/userEntity";
import { ChatViewRequestModel } from "../../dataModels/v1/chatViewRequestModel";
import { ChatViewResponseModel } from "../../dataModels/v1/chatViewResponseModel";

export class UserViewsAChatUseCase {
    userGateway: UserGateway;
    chatGateway: ChatGatewayToShareChat;

    constructor(userGateway: UserGateway, chatGateway: ChatGatewayToShareChat) {
        this.userGateway = userGateway;
        this.chatGateway = chatGateway;
    }

    async execute(chatViewModel: ChatViewRequestModel) : Promise<ChatViewResponseModel> {
        let user: UserEntity | undefined;
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
                chatMessages: (),
                error: 'User not found'
            };

            return chatViewResponseModel;
        }

        const chat = await this.chatGateway.getChatById(chatViewModel.chatId);

        chatViewResponseModel = {
            chatId: chat.id,
            chatName: "PlaceholderName",
            chatMessages: (),
            error: null
        };

        return chatViewResponseModel;
    }
}