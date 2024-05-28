import RequestModel from "../../useCaseBoundaries/general/requestModel";

export default class CreateChatAsUserToBeParticipatorRequestModel implements RequestModel {
    userId: string;
    chatName: string;
    flowId: string;

    constructor(userId: string, chatName: string, flowId: string) {
        this.userId = userId;
        this.chatName = chatName;
    this.flowId = flowId;
    }
}