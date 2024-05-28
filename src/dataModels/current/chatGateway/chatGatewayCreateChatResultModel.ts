import ChatEntityForProceedInChat from "../../../entities/chatEntity/chatEntityForProceedInChat";
import ChatGatewayResultModel from "./chatGatewayResultModel";

export default class ChatGatewayCreateChatResultModel implements ChatGatewayResultModel {
    chat: ChatEntityForProceedInChat;
    success: boolean;
    error: string;

    constructor(
        chat: ChatEntityForProceedInChat,
        success: boolean,
        error: string = ''
    ) {
        this.chat = chat;
        this.success = success;
        this.error = error;
    }
}