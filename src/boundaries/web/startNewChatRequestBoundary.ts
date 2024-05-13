import { ChatStartRequestModel } from "../../dataModels/chatStartRequestModel";
import ChatStartResultModel from "../../dataModels/chatStartResultModel";
import WebToUsecaseBoundary from "./webToUsecaseBoundary";

export interface StartNewChatRequestBoundary extends WebToUsecaseBoundary{
    sendStartNewChatRequest(chatStartRequestModel: ChatStartRequestModel): Promise<ChatStartResultModel>;
}