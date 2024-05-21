import { ChatEntity } from "../../entities/chatEntity/chatEntity";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToViewChatHistory extends ChatGateway{
    getChatHistoryById(chatId: string): Promise<ChatEntity[]>;
}