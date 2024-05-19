import { ChatEntity } from "../../entities/chatEntity";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToShareAChat extends ChatGateway {
    getChatById(chatId: string): Promise<ChatEntity>;
}