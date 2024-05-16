import RequestModel from "../general/requestModel";

export default class ShareAChatAsUserRequestModel implements RequestModel {
    chatId: string;
    userId: string;

    constructor(chatId: string, userId: string) {
        this.chatId = chatId;
        this.userId = userId;
    }
}