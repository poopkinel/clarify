import ChatStateForProceedInChat from "../chatState/chatState";

export default interface ChatEntityForProceedInChat {
    currentState: ChatStateForProceedInChat;
    participator1UserId: string;
    participator2UserId: string;
    chatFlowId: string;
    isEnded: boolean;
};