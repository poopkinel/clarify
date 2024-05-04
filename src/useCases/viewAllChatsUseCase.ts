// A use case where the operator views all chats

import { ChatGateway } from "../boundaries/persistence/chatGateway";
import { ChatEntity } from "../entities/chatEntity";

export class ViewAllChatsUseCase {
    private chatGateway: ChatGateway;

    constructor(chatGateway: ChatGateway) {
        this.chatGateway = chatGateway;
    }

    async execute(): Promise<ChatEntity[]> {
        const chats = await this.chatGateway.getAllChats();
        return chats;
    }
}