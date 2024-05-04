// A use case for an operator to retrieve a chat for inspection

import { ChatGateway } from "../boundaries/persistence/chatGateway";
import { ChatEntity } from "../entities/chatEntity";

export class RetrieveAChat {
    private chatGateway: ChatGateway;

    constructor(chatGateway: ChatGateway) {
        this.chatGateway = chatGateway;
    }

    async execute(chatId: string): Promise<ChatEntity> {
        try 
        {
            const chat = await this.chatGateway.getChatById(chatId);
            return chat;
        }
        catch (error) 
        {
            throw new Error('Chat not found');
        }
    }
}