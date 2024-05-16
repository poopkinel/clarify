import { ChatStartRequestModel } from "../../dataModels/v1/chatStartRequestModel";
import ChatStartResultModel from "../../dataModels/v1/chatStartResultModel";
import WebToUsecaseBoundary from "./webToUsecaseBoundary";

export interface StartNewChatRequestBoundary extends WebToUsecaseBoundary{
    sendStartNewChatRequest(chatStartRequestModel: ChatStartRequestModel): Promise<ChatStartResultModel>;
}