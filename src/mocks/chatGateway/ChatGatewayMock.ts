import ChatGatewayToProceedInChat from '../../boundaries/gateways/chat/chatGatewayToProceedInChat';

export default class ChatGatewayMock implements ChatGatewayToProceedInChat {
    constructor(
        private chatGatewayResultModelStub: any,
        private chatStub: any,
        private currentStateStub: any,

        private firstSetupData: any,
        private secondSetupData: any,
    ) { }

    requestIndex = 0;

    getChatById = () => {
        if (this.requestIndex === 0) {
            this.requestIndex++;
            return {
                ...this.chatGatewayResultModelStub,
                success: this.firstSetupData.chatGatewayResultSuccess,
                error: this.firstSetupData.chatGatewayResultError,
                chat: {
                    ...this.chatStub,
                    isEnded: this.firstSetupData.isChatEnded,
                    currentState: {
                        ...this.currentStateStub,
                        id: this.firstSetupData.currentStateId
                    }
                }
            }
        } else {
            return {
                ...this.chatGatewayResultModelStub,
                success: this.secondSetupData.chatGatewayResultSuccess,
                error: this.secondSetupData.chatGatewayResultError,
                chat: {
                    ...this.chatStub,
                    isEnded: this.secondSetupData.isChatEnded,
                    currentState: {
                        ...this.currentStateStub,
                        id: this.secondSetupData.currentStateId
                    }
                }
            }
        }
    }; 
    
    resetRequestIndex = () => {
        this.requestIndex = 0;
    }
}