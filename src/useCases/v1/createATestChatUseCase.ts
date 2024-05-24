// Operator creates a test chat

import { ChatEntity } from '../../entities/chatEntity/chatEntity';
import ChatGatewayToShareChat from '../../boundaries/gateways/chatGatewayToShareChat';

export class CreateATestChatUseCase {
    private chatGateway: ChatGatewayToShareChat;

    constructor(chatGateway: ChatGatewayToShareChat) {
        this.chatGateway = chatGateway;
    }

    async execute(chatName: string, user1: string, user2: string): Promise<string> {
        // const chatId = await this.chatGateway.createChat(chatName, user1, user2);
        // return chatId;
        return "";
    }
}
