import { ChatGateway } from "../../boundaries/persistence/chatGateway";
import { ChatEntity } from "../../entities/chatEntity";

var chat0 = new ChatEntity(
    "0",
    "chatName0",
    "user1",
    "user2",
);

var chat1 = new ChatEntity(
    "1",
    "chatName1",
    "user1",
    "user2",
);

var chat2 = new ChatEntity(
    "2",
    "chatName2",
    "user1",
    "user2",
);

export class ChatGatewayMockImpl implements ChatGateway {
    constructor() {
    }

    async createChat(chatName: string, user1: string, user2: string): Promise<string> {
        return 'chatId';
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