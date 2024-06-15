import ChatFlowGetNextStateResult from "../../src/dataModels/current/chatFlow/chatFlowGetNextStateResult";
import ChatFlowEntityForProceedInChat from "../../src/entities/chatFlow/chatFlowEntityForProceedInChat";
import ChatStateForProceedInChat from "../../src/entities/chatState/chatState";
import ChatResponseOptions from "../../src/entities/responseOption/chatResponseOptions";

export default class ChatFlowSingleRequestMock implements ChatFlowEntityForProceedInChat{
    constructor(
        private sucess: boolean,
        private error: string,

        private nextStateId: string,
        private participator1NextState: string,
        private participator2NextState: string,

        private participator1Options: ChatResponseOptions,
        private participator2Options: ChatResponseOptions,

        private isEndState: boolean,
        private proceedEvent: string,
    ) { }

    async tryGetNextState(currentState: ChatStateForProceedInChat, proceedEvent: string): Promise<ChatFlowGetNextStateResult> {
        return {
            success: this.sucess,
            error: this.error,
            nextState: {
                id: this.nextStateId,
                participator1NextState: this.participator1NextState,
                participator2NextState: this.participator2NextState,
                participator1Options: this.participator1Options,
                participator2Options: this.participator2Options,
                isEndState: this.isEndState,
                proceedEvent: this.proceedEvent // Remove proceedEvent
            }
        }
    }
}