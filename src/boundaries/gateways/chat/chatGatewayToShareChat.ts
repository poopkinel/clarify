import ChatEntityForShare from "../../entities/chatEntity/chatEntityForShare";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToShareChat extends ChatGateway {
    getChatById(chatId: string): Promise<ChatEntityForShare>;
}