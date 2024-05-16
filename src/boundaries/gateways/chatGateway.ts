import { ChatViewResponseModel } from "../../dataModels/v1/chatViewResponseModel";
import { ChatEntity } from "../../entities/chatEntity";

export default interface ChatGateway {
    createChat(chatName: string, user1: string, user2: string): Promise<string>;
    getAllChats(): Promise<ChatEntity[]>;
    getChatById(chatId: string): Promise<ChatEntity>;
    // addMessageToChat(chatId: string, messageText: string, messageAuthor: string): Promise<void>;
    deleteChat(chatId: string): Promise<void>;

    //isChatNameUnique(chatName: string): Promise<boolean>;
}