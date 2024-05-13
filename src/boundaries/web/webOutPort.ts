import { StartNewChatResultBoundary } from "./startNewChatResultBoundary";
import ChatStartResultModel from "../../dataModels/chatStartResultModel";

export interface WebOutPort extends StartNewChatResultBoundary {
    sendStartNewChatResult(chatStartRequestModel: ChatStartResultModel): Promise<any>
}