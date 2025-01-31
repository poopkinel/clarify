import ResultModel from "../../useCaseBoundaries/general/resultModel";

type Response = {
    text: string,
    responseId: string
    responseType: string
}

type ChatHistory = { 
    chatId: string,
    participator1UserId: string,
    participator2UserId: string,
    responses: {
        text: string,
        responseId: string,
        responseType: string
    }();
 }();

export default class ViewChatHistoryAsUserResultModel implements ResultModel {
    userId: string;
    chatHistory: ChatHistory;

    constructor(userId: string, chatHistory: ChatHistory) {
        this.userId = userId;
        this.chatHistory = chatHistory;
    }
}