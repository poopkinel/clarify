import RequestModel from "../../useCaseBoundaries/general/requestModel";

export default class ViewChatRequestModel implements RequestModel {
    chatId: string;

    constructor(chatId: string) {
        this.chatId = chatId;
    }
}