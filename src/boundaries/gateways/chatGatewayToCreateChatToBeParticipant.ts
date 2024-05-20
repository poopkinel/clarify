import ChatGateway from "./chatGateway";

export default interface ChatGatewayToCreateChatAsParticipant extends ChatGateway {
    createChatToBeParticipant(chatId: string, userId: string): Promise<{
        success: boolean;
        error: string;
    }>;
};