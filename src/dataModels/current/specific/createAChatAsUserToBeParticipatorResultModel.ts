import ResultModel from "../general/resultModel";

export default class CreateAChatAsUserToBeParticipatorResultModel implements ResultModel {
    userId: string;
    success: boolean;
    createdChatId: string;
    otherParticipatorLink: string;
    viewerLink: string;
    error: string;

    constructor(
        userId: string,
        success: boolean, 
        createdChatId: string, 
        otherParticipatorLink: string, 
        viewerLink: string, 
        error: string = ''
    ) {
        this.userId = userId;
        this.success = success;
        this.createdChatId = createdChatId;
        this.otherParticipatorLink = otherParticipatorLink;
        this.viewerLink = viewerLink;
        this.error = error;
    }
}