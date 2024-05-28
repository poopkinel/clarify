import RequestModel from "../../useCaseBoundaries/general/requestModel";

export default class ViewChatHistoryAsUserRequestModel implements RequestModel {
    chatId: string;
    userId: string;

    constructor(chatId: string, userId: string) {
        this.chatId = chatId;
        this.userId = userId;
    }
}