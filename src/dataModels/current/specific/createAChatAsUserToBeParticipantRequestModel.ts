import RequestModel from "../general/requestModel";

export default class CreateAChatAsUserToBeParticipantRequestModel implements RequestModel {
    userId: string;
    chatName: string;

    constructor(userId: string, chatName: string) {
        this.userId = userId;
        this.chatName = chatName;
    }
}