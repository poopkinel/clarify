import ChatGatewayToShareChat from "../../../boundaries/gateways/chat/chatGatewayToShareChat";
import ChatEntity from "../../../entities/chatEntity/chatEntity";

export default class ChatGatewayMockImpl implements ChatGatewayToShareChat {
    createChat(chatName: string, user1: string, user2: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getAllChats(): Promise<ChatEntity[]> {
        throw new Error("Method not implemented.");
    }
    getChatById(chatId: string): Promise<ChatEntity> {
        return new Promise((resolve, reject) => {
            resolve({} as ChatEntity);
            // resolve(new ChatEntity(
            //     '0',
            //     'Test Chat',
            //     'Test User 1',
            //     'Test User 2',
            //     true
            //     )
            // );
        });
    }
    deleteChat(chatId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}