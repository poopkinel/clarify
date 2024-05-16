// A use case for an operator to retrieve a chat for inspection

import { ChatGateway } from "../../boundaries/gateways/chatGateway";
import RequestModel from "../../dataModels/current/general/requestModel";
import RetrieveAChatRequestModel from "../../dataModels/v1/retrieveAChatRequestModel";
import { ChatEntity } from "../../entities/chatEntity";

export class RetrieveAChatUseCase {
    private chatGateway: ChatGateway;

    constructor(chatGateway: ChatGateway) {
        this.chatGateway = chatGateway;
    }

    async execute(requetModel: RetrieveAChatRequestModel): Promise<ChatEntity> {
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