import CreateAChatAsUserToBeParticipantResultModel from "../../dataModels/current/specific/createAChatAsUserToBeParticipantResultModel";
import ChatEntityForUserToBeParticipant from "../../entities/chatEntity/chatEntityForUserToBeParticipant";
import ChatGateway from "./chatGateway";

export default interface ChatGatewayToCreateChatAsParticipant extends ChatGateway {
    createChatToBeParticipant(userId: string, chatName: string): Promise<ChatEntityForUserToBeParticipant>;
};