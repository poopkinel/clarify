import ChatResponseOptions from "../responseOption/chatResponseOptions";

export default interface ChatStateForProceedInChat { // split to ChatStateForProceedInChatNextState and ChatStateForProceedInChatCurrentState
    id: string;
    participator1NextState: string;
    participator2NextState: string;
    proceedEvent: string; // This stays for the next state class
    participator1Options: ChatResponseOptions;
    participator2Options: ChatResponseOptions;
}