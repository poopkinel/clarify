// A use case where the operator views all chats

import ChatGatewayToShareAChat from "../../boundaries/gateways/chatGatewayToShareAChat";
import { ChatEntity } from "../../entities/chatEntity/chatEntity";

export class ViewAllChatsUseCase {
    private chatGateway: ChatGatewayToShareAChat;

    constructor(chatGateway: ChatGatewayToShareAChat) {
        this.chatGateway = chatGateway;
    }

    async execute(): Promise<ChatEntity[]> {
        const chats: ChatEntity[] = [] ;//await this.chatGateway.getAllChats();
        return chats;
    }
}