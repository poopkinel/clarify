// A use case for an operator to retrieve a chat for inspection

import ChatGatewayToShareChat from "../../boundaries/gateways/chat/chatGatewayToShareChat";
import RequestModel from "../../dataModels/useCaseBoundaries/general/requestModel";
import RetrieveAChatRequestModel from "../../dataModels/v1/retrieveAChatRequestModel";
import { ChatEntity } from "../../entities/chatEntity/chatEntity";
import ChatEntityForShare from "../../entities/chatEntity/chatEntityForShare";

export class RetrieveAChatUseCase {
    private chatGateway: ChatGatewayToShareChat;

    constructor(chatGateway: ChatGatewayToShareChat) {
        this.chatGateway = chatGateway;
    }

    async execute(requetModel: RetrieveAChatRequestModel): Promise<ChatEntityForShare> {
        try 
        {
            const chat = await this.chatGateway.getChatById(requetModel.chatId);
            return chat;
        }
        catch (error) 
        {
            throw new Error('Chat not found');
        }
    }
}