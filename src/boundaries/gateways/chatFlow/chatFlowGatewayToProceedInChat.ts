import ChatFlowForProceedInChat from "../../../entities/chatFlow/chatFlowForProceedInChat";

export default interface ChatFlowGatewayToProceedInChat {
    getChatFlowById(chatId: string): Promise<ChatFlowForProceedInChat>;
};