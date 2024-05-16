import ResultModel from "../general/resultModel";

export default class ShareAChatAsUserResultModel implements ResultModel {
    chatId: string;
    userId: string;
    sharingPermissions: string;
    error: string;

    constructor(chatId: string, userId: string, sharingPermissions: string, error: string) {
        this.chatId = chatId;
        this.userId = userId;
        this.sharingPermissions = sharingPermissions;
        this.error = error;
    }
}