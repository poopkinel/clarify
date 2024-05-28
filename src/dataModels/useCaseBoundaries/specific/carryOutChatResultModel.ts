import ResultModel from "../../useCaseBoundaries/general/resultModel";

type Response = {
    text: string,
    responseId: string
    responseType: string
}

export default class CarryOutChatResultModel implements ResultModel {
    private chatId: string;
    private firstParticipatorId: string;
    private secondParticipatorId: string;
    private responses: Response[];
    private chatIsFinished: boolean;
    private preferredParticipatorId: string;
    private unpreferredParticipatorId: string;
    private currentStateId: string;

    constructor(
        chatId: string,
        firstParticipatorId: string,
        secondParticipatorId: string,
        responses: Response[],
        chatIsFinished: boolean, 
        preferredParticipatorId: string,
        unpreferredParticipatorId: string,
        currentStateId: string
    ) {
        this.chatId = chatId;
        this.firstParticipatorId = firstParticipatorId;
        this.secondParticipatorId = secondParticipatorId;
        this.responses = responses;
        this.chatIsFinished = chatIsFinished;
        this.preferredParticipatorId = preferredParticipatorId;
        this.unpreferredParticipatorId = unpreferredParticipatorId;
        this.currentStateId = currentStateId;
    }
}