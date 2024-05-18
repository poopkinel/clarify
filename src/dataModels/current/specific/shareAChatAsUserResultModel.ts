import ResultModel from "../general/resultModel";

export default class ShareAChatAsUserResultModel implements ResultModel {
    chatId: string;
    userId: string;
    access: string;
    error: string;

    link: string;

    constructor(chatId: string, 
                userId: string, 
                access: string, 
                error: string,
                link: string) {
        this.chatId = chatId;
        this.userId = userId;
        this.access = access;
        this.error = error;
        this.link = link;
    }
}