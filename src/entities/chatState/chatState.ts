import ChatResponseOptions from "../responseOption/chatResponseOptions";

export default interface ChatStateForProceedInChat { // TODO: split to ChatStateForProceedInChatNextState and ChatStateForProceedInChatCurrentState
    id: string;
    participator1NextState: string;
    participator2NextState: string;
    participator1Options: ChatResponseOptions;
    participator2Options: ChatResponseOptions;
    isEndState: boolean;
}