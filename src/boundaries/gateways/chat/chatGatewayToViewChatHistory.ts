import { ChatEntity } from "../../../entities/chatEntity/chatEntity";
import ChatEntityForViewingChatHistory from "../../../entities/chatEntity/chatEntityForViewingChatHistory";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToViewChatHistory extends ChatGateway{
    getChatHistoryById(chatId: string): Promise<ChatEntityForViewingChatHistory[]>;
}