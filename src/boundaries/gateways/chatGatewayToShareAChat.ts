import ChatEntityForShare from "../../entities/chatEntityForShare";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToShareAChat extends ChatGateway {
    getChatById(chatId: string): Promise<ChatEntityForShare>;
}