import ResultModel from "../general/resultModel";

type Response = { ['text']: string, ['onStateId']: string };

export default class ShareAChatAsUserResultModel implements ResultModel {
    chatId: string;
    userId: string;
    responses: Response[];
    access: string;
    error: string;

    constructor(chatId: string, userId: string, responses: Response[], access: string, error: string) {
        this.chatId = chatId;
        this.userId = userId;
        this.responses = responses;
        this.access = access;
        this.error = error;
    }
}