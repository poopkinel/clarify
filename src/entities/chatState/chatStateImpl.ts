import ChatResponseOptions from "../responseOption/chatResponseOptions";
import ChatStateForProceedInChat from "./chatState";

export default class ChatStateImpl implements ChatStateForProceedInChat {
    id: string;
    participator1NextState: string;
    participator2NextState: string;
    proceedEvent: string;
    participator1Options: ChatResponseOptions;
    participator2Options: ChatResponseOptions;
    isEndState: boolean;

    constructor(id: string, participator1State: string, participator2State: string, proceedEvent: string, 
        participator1Options: ChatResponseOptions, participator2Options: ChatResponseOptions, isEndState: boolean
    ) {
        this.id = id;
        this.participator1NextState = participator1State;
        this.participator2NextState = participator2State;
        this.proceedEvent = proceedEvent;

        this.participator1Options = participator1Options;
        this.participator2Options = participator2Options;

        this.isEndState = isEndState;
    }
}