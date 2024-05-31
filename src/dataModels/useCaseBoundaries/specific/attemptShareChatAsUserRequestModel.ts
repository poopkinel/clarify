import RequestModel from "../general/requestModel";

export default class AttemptShareChatAsUserRequestModel implements RequestModel {
    chatId: string;
    userId: string;

    constructor(chatId: string, userId: string) {
        this.chatId = chatId;
        this.userId = userId;
    }
}