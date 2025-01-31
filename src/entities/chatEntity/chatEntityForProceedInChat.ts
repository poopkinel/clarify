import ChatStateForProceedInChat from "../chatState/chatState";

export default interface ChatEntityForProceedInChat {
    currentStateId: string;
    participator1UserId: string;
    participator2UserId: string;
    chatFlowId: string;
    isEnded: boolean;

    setCurrentState(newCurrentState: string): void;
};