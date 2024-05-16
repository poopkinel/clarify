import ChatGateway from "../../../boundaries/gateways/chatGateway";
import { ChatEntity } from "../../../entities/chatEntity";

export default class ChatGatewayMockImpl implements ChatGateway {
    createChat(chatName: string, user1: string, user2: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getAllChats(): Promise<ChatEntity[]> {
        throw new Error("Method not implemented.");
    }
    getChatById(chatId: string): Promise<ChatEntity> {
        return new Promise((resolve, reject) => {
            resolve({
                id: '0',
                name: 'Test Chat',
                user1: 'Test User 1',
                user2: 'Test User 2',
                responses: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });
    }
    deleteChat(chatId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}