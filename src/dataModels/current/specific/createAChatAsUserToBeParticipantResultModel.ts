import ResultModel from "../general/resultModel";

export default class CreateAChatAsUserToBeParticipantResultModel implements ResultModel {
    createdChatId: string;
    otherParticipantLink: string;
    viewerLink: string;
    // success: boolean;
    // error: string;

    constructor(createdChatId: string, otherParticipantLink: string, viewerLink: string) {
        this.createdChatId = createdChatId;
        this.otherParticipantLink = otherParticipantLink;
        this.viewerLink = viewerLink;
    }
}