import ResultModel from "../general/resultModel";

type Response = {
    text: string,
    responseId: string
    responseType: string
}

export default class ViewChatResultModel implements ResultModel{
    chatId: string;
    participator1UserId: string;
    participator2UserId: string;
    chatName: string;
    access: string;
    responses: Response[];

    constructor(chatId: string,
                participator1UserId: string,
                participator2UserId: string,
                chatName: string,
                access: string,
                responses: Response[]) {
        this.chatId = chatId;
        this.participator1UserId = participator1UserId;
        this.participator2UserId = participator2UserId;
        this.chatName = chatName;
        this.access = access;
        this.responses = responses;
    }
};