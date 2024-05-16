import StartNewChatResultBoundary from "./startNewChatResultBoundary";
import ChatStartResultModel from "../../dataModels/v1/chatStartResultModel";

export interface WebOutPort extends StartNewChatResultBoundary {
    sendStartNewChatResult(chatStartRequestModel: ChatStartResultModel): Promise<any>
}