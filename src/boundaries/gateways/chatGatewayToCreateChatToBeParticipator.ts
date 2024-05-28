import CreateChatAsUserToBeParticipatorResultModel from "../../dataModels/current/specific/createChatAsUserToBeParticipatorResultModel";
import ChatEntityForUserToBeParticipator from "../../entities/chatEntity/chatEntityForUserToBeParticipator";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToCreateChatAsParticipator extends ChatGateway {
    createChatToBeParticipator(userId: string, chatName: string, flowId: string): Promise<ChatEntityForUserToBeParticipator>;
};