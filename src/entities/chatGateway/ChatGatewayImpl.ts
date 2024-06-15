import ChatGatewayToProceedInChat from '../../boundaries/gateways/chat/chatGatewayToProceedInChat';
import ChatGatewayCreateChatResultModel from '../../dataModels/current/chatGateway/chatGatewayCreateChatResultModel';

export default class ChatGatewayImpl implements ChatGatewayToProceedInChat {
    constructor() {
    }

    async getChatById(chatId: string): Promise<ChatGatewayCreateChatResultModel> {
        // raise unimplemented exception
        throw new Error('Method not implemented.');        
    }
}