import RequestModel from "../current/general/requestModel";

export default class RetrieveAChatRequestModel implements RequestModel {
    chatId: string;
    username: string;

    constructor(chatId: string, username: string) {
        this.chatId = chatId;
        this.username = username;
    }
}