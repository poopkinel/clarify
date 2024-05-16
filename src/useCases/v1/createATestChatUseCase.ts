// Operator creates a test chat

import { ChatEntity } from '../../entities/chatEntity';
import { ChatGateway } from '../../boundaries/gateways/chatGateway';

export class CreateATestChatUseCase {
    private chatGateway: ChatGateway;

    constructor(chatGateway: ChatGateway) {
        this.chatGateway = chatGateway;
    }

    async execute(chatName: string, user1: string, user2: string): Promise<string> {
        const chatId = await this.chatGateway.createChat(chatName, user1, user2);
        return chatId;
    }
}
