import ChatGatewayToProceedInChat from '../../boundaries/gateways/chat/chatGatewayToProceedInChat';
import ChatGatewayCreateChatResultModel from '../../dataModels/current/chatGateway/chatGatewayCreateChatResultModel';

export default class ChatGatewayImpl implements ChatGatewayToProceedInChat {
    constructor() {
    }

    getChatById(chatId: string): Promise<ChatGatewayCreateChatResultModel> {
        
    }
}