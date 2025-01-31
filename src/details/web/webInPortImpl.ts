import { ChatStartRequestModel } from "../../dataModels/v1/chatStartRequestModel";
import { StartNewChatRequestBoundary } from "../../boundaries/web/startNewChatRequestBoundary";
import ChatStartResultModel from "../../dataModels/v1/chatStartResultModel";
import WebToUsecaseBoundary from "../../boundaries/web/webToUsecaseBoundary";
import WebInPort from "../../boundaries/web/webInPort";
import { ProceedInChatResultModel } from "../../dataModels/useCaseBoundaries/specific/proceedInChatResultModel";
import ProceedInChatRequestModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatRequestModel";
import ProceedInChatUseCase from "../../useCases/current/proceedInChatUseCase";

export class WebInPortImpl implements WebInPort {
    
    private startNewChatRequestBoundary: WebToUsecaseBoundary;

    constructor(startNewChatRequestBoundary: WebToUsecaseBoundary) {
        this.startNewChatRequestBoundary = startNewChatRequestBoundary;
    }

    createRequestModel(username: string, chatName: string): ChatStartRequestModel {
        return new ChatStartRequestModel(username, chatName);
    }

    async startNewChat(webStartNewChatRequestModel: any): Promise<ChatStartResultModel> {
        const chatStartRequestModel = new ChatStartRequestModel(webStartNewChatRequestModel.chatName, webStartNewChatRequestModel.userId);
        return this.startNewChatRequestBoundary.sendStartNewChatRequest(chatStartRequestModel);
    }

    // async getNextChatPhase(nextChatPhaseRequestModel: any): Promise<ProceedInChatResultModel> {
    //     const chatStartRequestModel = new ProceedInChatRequestModel(
    //         nextChatPhaseRequestModel.userId,
    //         nextChatPhaseRequestModel.chatName,
    //         nextChatPhaseRequestModel.chatPhase
    //     );
    // }
}