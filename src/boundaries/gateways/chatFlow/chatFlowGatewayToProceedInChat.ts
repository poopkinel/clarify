import ChatFlowEntityForProceedInChat from "../../../entities/chatFlow/chatFlowEntityForProceedInChat";

export default interface ChatFlowGatewayToProceedInChat {
    getChatFlowById(chatId: string): Promise<ChatFlowEntityForProceedInChat>;
};