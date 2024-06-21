// A use case where the operator views all chats

import ChatGatewayToShareChat from "../../boundaries/gateways/chat/chatGatewayToShareChat";
import ChatEntity from "../../entities/chatEntity/chatEntity";

export class ViewAllChatsUseCase {
    private chatGateway: ChatGatewayToShareChat;

    constructor(chatGateway: ChatGatewayToShareChat) {
        this.chatGateway = chatGateway;
    }

    async execute(): Promise<ChatEntity[]> {
        const chats: ChatEntity[] = [] ;//await this.chatGateway.getAllChats();
        return chats;
    }
}