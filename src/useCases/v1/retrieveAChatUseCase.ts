// A use case for an operator to retrieve a chat for inspection

import ChatGatewayToShareAChat from "../../boundaries/gateways/chatGatewayToShareAChat";
import RequestModel from "../../dataModels/current/general/requestModel";
import RetrieveAChatRequestModel from "../../dataModels/v1/retrieveAChatRequestModel";
import { ChatEntity } from "../../entities/chatEntity";
import ChatEntityForShare from "../../entities/chatEntityForShare";

export class RetrieveAChatUseCase {
    private chatGateway: ChatGatewayToShareAChat;

    constructor(chatGateway: ChatGatewayToShareAChat) {
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