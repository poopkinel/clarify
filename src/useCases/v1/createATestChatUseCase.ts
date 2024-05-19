// Operator creates a test chat

import { ChatEntity } from '../../entities/chatEntity';
import ChatGatewayToShareAChat from '../../boundaries/gateways/chatGatewayToShareAChat';

export class CreateATestChatUseCase {
    private chatGateway: ChatGatewayToShareAChat;

    constructor(chatGateway: ChatGatewayToShareAChat) {
        this.chatGateway = chatGateway;
    }

    async execute(chatName: string, user1: string, user2: string): Promise<string> {
        // const chatId = await this.chatGateway.createChat(chatName, user1, user2);
        // return chatId;
        return "";
    }
}
