import ChatStateForProceedInChat from "../chatState/ChatStateForProceedInChat";

export default interface ChatEntityForProceedInChat {
    currentState: ChatStateForProceedInChat;
    participator1UserId: string;
    participator2UserId: string;
    chatFlowId: string;
    isEnded: boolean;

    setCurrentState(newCurrentState: ChatStateForProceedInChat): void;
};