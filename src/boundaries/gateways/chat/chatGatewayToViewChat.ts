import ChatEntityForViewingChat from "../../../entities/chatEntity/chatEntityForViewingChat";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToViewChat extends ChatGateway{
    getChatById(chatId: string): Promise<ChatEntityForViewingChat>;
}