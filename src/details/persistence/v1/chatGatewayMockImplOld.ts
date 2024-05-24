import ChatGatewayToShareChat from "../../../boundaries/gateways/chatGatewayToShareChat";
import { ChatEntity } from "../../../entities/chatEntity/chatEntity";

var chat0 = new ChatEntity(
    "0",
    "chatName0",
    "user1",
    "user2",
    true
);

var chat1 = new ChatEntity(
    "1",
    "chatName1",
    "user1",
    "user2",
    true
);

var chat2 = new ChatEntity(
    "2",
    "chatName2",
    "user1",
    "user2",
    true
);

export class ChatGatewayMockImpl implements ChatGatewayToShareChat {
    constructor() {
    }

    async createChat(chatName: string, user1: string, user2: string): Promise<string> {
        return 'mockChatId';
    }

    async getAllChats(): Promise<ChatEntity[]> {
        return [chat0, chat1, chat2];
    }

    async getChatById(chatId: string): Promise<ChatEntity> {
        if (chatId === '0') {
            return chat0
        } else if (chatId === '1'){
            return chat1;
        } else {
            return chat2;
        }
    }

    async addMessageToChat(chatId: string, messageText: string, messageAuthor: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deleteChat(chatId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}