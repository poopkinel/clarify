import ChatResponseOptions from "../responseOption/chatResponseOptions";

export default interface ChatStateForProceedInChat {
    id: string;
    participator1NextState: string;
    participator2NextState: string;
    proceedEvent: string;
    participator1Options: ChatResponseOptions;
    participator2Options: ChatResponseOptions;
}