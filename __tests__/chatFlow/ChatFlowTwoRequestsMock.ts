import ChatFlowEntityForProceedInChat from "../../src/entities/chatFlow/chatFlowEntityForProceedInChat";
import ChatFlowGetNextStateResult from "../../src/dataModels/current/chatFlow/chatFlowGetNextStateResult";
import ChatStateForProceedInChat from "../../src/entities/chatState/chatState";

export default class ChatFlowTwoRequestsMock implements ChatFlowEntityForProceedInChat{
    constructor(
        private chatFlowGatewayResultModelStub: any,
        private chatFlowStub: any,
        private firstSetupData: any,
        private secondSetupData: any,
    ) { }

    requestIndex = 0;

    async tryGetNextState(currentState: ChatStateForProceedInChat, proceedEvent: string): Promise<ChatFlowGetNextStateResult> {
        if (this.requestIndex === 0) {
            this.requestIndex++;
            return {
                ...this.chatFlowGatewayResultModelStub,
                success: this.firstSetupData.chatFlowGatewayResultSuccess,
                error: this.firstSetupData.chatFlowGatewayResultError,
                nextState: {
                    ...this.chatFlowStub,
                    id: this.firstSetupData.nextStateId
                }
            }
        } else {
            return {
                ...this.chatFlowGatewayResultModelStub,
                success: this.secondSetupData.chatFlowGatewayResultSuccess,
                error: this.secondSetupData.chatFlowGatewayResultError,
                nextState: {
                    ...this.chatFlowStub,
                    id: this.secondSetupData.nextStateId
                }
            }
        }
    }

    resetRequestIndex = () => {
        this.requestIndex = 0;
    }
}