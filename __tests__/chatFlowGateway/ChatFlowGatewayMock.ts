import ChatFlowGatewayToProceedInChat from "../../src/boundaries/gateways/chatFlow/chatFlowGatewayToProceedInChat";
import ChatEntityForProceedInChat from "../../src/entities/chatEntity/chatEntityForProceedInChat";
import ChatFlowEntityForProceedInChat from "../../src/entities/chatFlow/chatFlowEntityForProceedInChat";
import ChatFlowMock from "../chatFlow/ChatFlowTwoRequestsMock";

export default class ChatFlowGatewayMock implements ChatFlowGatewayToProceedInChat {
    constructor(
        private chatFlowGatewayResultModelStub: any,
        private chatFlowStub: any,
        private firstSetupData: any,
        private secondSetupData: any,
    ) { }
    async getChatFlowById(chatFlowId: string): Promise<ChatFlowEntityForProceedInChat> {
        return new ChatFlowMock(
            this.chatFlowGatewayResultModelStub,
            this.chatFlowStub,
            this.firstSetupData,
            this.secondSetupData
        );
    }
}