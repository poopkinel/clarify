import ChatState from "../chatState/chatState";

export default interface ChatEntityForProceedInChat {
    currentState: ChatState;
    participator1UserId: string;
    participator2UserId: string;
};