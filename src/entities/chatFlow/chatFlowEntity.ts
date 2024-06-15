import ChatFlowGetNextStateResult from "../../dataModels/current/chatFlow/chatFlowGetNextStateResult";
import ChatStateForProceedInChat from "../chatState/chatState";
import ChatResponseOptions from "../responseOption/chatResponseOptions";
import ChatFlowEntityForProceedInChat from "./chatFlowEntityForProceedInChat";

export default class ChatFlowEntity implements ChatFlowEntityForProceedInChat {
    // constructor(
    //     private sucess: boolean,
    //     private error: string,

    //     private nextStateId: string,
    //     private participator1NextState: string,
    //     private participator2NextState: string,

    //     private participator1Options: ChatResponseOptions,
    //     private participator2Options: ChatResponseOptions,

    //     private isEndState: boolean,
    //     private proceedEvent: string,
    // ) { }

    async tryGetNextState(currentState: ChatStateForProceedInChat, proceedEvent: string): Promise<ChatFlowGetNextStateResult> {
        return {
            success: true,
            error: "",
            nextState: {
                id: "state1",
                participator1NextState: "",
                participator2NextState: "",
                participator1Options: {
                    options: [],
                },
                participator2Options: {
                    options: [],
                },
                isEndState: false,
                proceedEvent: "", // Remove proceedEvent
            }
        }
    }
}