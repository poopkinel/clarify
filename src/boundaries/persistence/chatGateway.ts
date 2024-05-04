import { ChatViewResponseModel } from "../../dataModels/chatViewResponseModel";
import { ChatEntity } from "../../entities/chatEntity";

export interface ChatGateway {
    createChat(chatName: string, user1: string, user2: string): Promise<string>;
    getAllChats(): Promise<ChatEntity[]>;
    getChatById(chatId: string): Promise<ChatEntity>;
    // addMessageToChat(chatId: string, messageText: string, messageAuthor: string): Promise<void>;
    deleteChat(chatId: string): Promise<void>;
}