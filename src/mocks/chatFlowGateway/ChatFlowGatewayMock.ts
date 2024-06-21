import ChatFlowGatewayToProceedInChat from "../../boundaries/gateways/chatFlow/chatFlowGatewayToProceedInChat";
import ChatEntityForProceedInChat from "../../entities/chatEntity/chatEntityForProceedInChat";
import ChatFlowEntityForProceedInChat from "../../entities/chatFlow/chatFlowEntityForProceedInChat";
import ChatFlowTwoRequestsMock from "../chatFlow/ChatFlowTwoRequestsMock";

export default class ChatFlowGatewayMock implements ChatFlowGatewayToProceedInChat {
    constructor(
        private chatFlowGatewayResultModelStub: any,
        private chatFlowStub: any,
        private firstSetupData: any,
        private secondSetupData: any,
    ) { }

    requestIndex = 0;

    async getChatFlowById(chatFlowId: string): Promise<ChatFlowEntityForProceedInChat> {
        if (this.requestIndex === 0) {
            this.requestIndex++;

            return new ChatFlowTwoRequestsMock(
                this.chatFlowGatewayResultModelStub,
                this.chatFlowStub,
                this.firstSetupData,
                this.secondSetupData,
                0,
            );

        } else {
            return new ChatFlowTwoRequestsMock(
                this.chatFlowGatewayResultModelStub,
                this.chatFlowStub,
                this.firstSetupData,
                this.secondSetupData,
                1,
            );
        }
            
    }
}