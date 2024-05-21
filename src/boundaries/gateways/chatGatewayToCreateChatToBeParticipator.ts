import CreateAChatAsUserToBeParticipatorResultModel from "../../dataModels/current/specific/createAChatAsUserToBeParticipatorResultModel";
import ChatEntityForUserToBeParticipator from "../../entities/chatEntity/chatEntityForUserToBeParticipator";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToCreateChatAsParticipator extends ChatGateway {
    createChatToBeParticipator(userId: string, chatName: string): Promise<ChatEntityForUserToBeParticipator>;
};