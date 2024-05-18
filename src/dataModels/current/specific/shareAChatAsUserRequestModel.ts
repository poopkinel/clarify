import RequestModel from "../general/requestModel";

export default class AttemptShareAChatAsUserRequestModel implements RequestModel {
    chatId: string;
    userId: string;

    constructor(chatId: string, userId: string) {
        this.chatId = chatId;
        this.userId = userId;
    }
}