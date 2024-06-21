import ChatFlowEntityForProceedInChat from "../../entities/chatFlow/chatFlowEntityForProceedInChat";
import ChatFlowGetNextStateResult from "../../dataModels/current/chatFlow/chatFlowGetNextStateResult";
import ChatStateForProceedInChat from "../../entities/chatState/chatState";
import { response } from "express";

export default class ChatFlowTwoRequestsMock implements ChatFlowEntityForProceedInChat{
    constructor(
        private chatFlowGatewayResultModelStub: any,
        private chatFlowStub: any,
        private firstSetupData: any,
        private secondSetupData: any,
        private requestIndex: number,
    ) { }

    async tryGetNextState(currentState: ChatStateForProceedInChat, proceedEvent: string): Promise<ChatFlowGetNextStateResult> {
        if (this.requestIndex === 0) {
            return {
                ...this.firstSetupData.nextStateResultStub,
                success: this.firstSetupData.nextStateResultSuccess,
                error: this.firstSetupData.nextStateResultError,
                nextState: {
                    ...this.chatFlowStub,
                    id: this.firstSetupData.nextStateId,
                    participator1Options: this.firstSetupData.responseOptions,
                    participator2Options: this.firstSetupData.responseOptions
                },
                proceedEvent: this.firstSetupData.proceedEvent
            }
        } else {
            return {
                ...this.secondSetupData.nextStateResultStub,
                success: this.secondSetupData.nextStateResultSuccess,
                error: this.secondSetupData.nextStateResultError,
                nextState: {
                    ...this.chatFlowStub,
                    id: this.secondSetupData.nextStateId,
                    participator1Options: this.secondSetupData.responseOptions,
                    participator2Options: this.secondSetupData.responseOptions
                },
                proceedEvent: this.secondSetupData.proceedEvent
            }
        }
    }

    resetRequestIndex = () => {
        this.requestIndex = 0;
    }
}