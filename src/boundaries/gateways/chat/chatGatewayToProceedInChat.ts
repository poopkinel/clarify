import ChatGatewayCreateChatResultModel from "../../../dataModels/current/chatGateway/chatGatewayCreateChatResultModel";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToProceedInChat extends ChatGateway {
    getChatById(chatId: string): Promise<ChatGatewayCreateChatResultModel>;
};