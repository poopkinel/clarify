import ChatGatewayToProceedInChat from "../../boundaries/gateways/chatEntity/chatGatewayToProceedInChat";
import ChatFlowGatewayToProceedInChat from "../../boundaries/gateways/chatFlow/chatFlowGatewayToProceedInChat";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ChatGatewayCreateChatResultModel from "../../dataModels/current/chatGateway/chatGatewayCreateChatResultModel";
import ProceedInChatRequestModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatRequestModel";
import ProceedInChatResultModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatResultModel";

export default class ProceedInChatUseCase {
    private usecaseOutBoundary: UsecaseOutBoundary<ProceedInChatResultModel>;
    private chatGatewayToProceedInChat: ChatGatewayToProceedInChat;
    private chatFlowGateway: ChatFlowGatewayToProceedInChat;
    constructor(
        usecaseOutBoundary: UsecaseOutBoundary<ProceedInChatResultModel>, 
        chatGatewayToProceedInChat: ChatGatewayToProceedInChat,
        chatFlowGateway: ChatFlowGatewayToProceedInChat
    ) {
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.chatGatewayToProceedInChat = chatGatewayToProceedInChat;
        this.chatFlowGateway = chatFlowGateway;
    }
    async executeProceedInChat(requestModel: ProceedInChatRequestModel) {
        const gatewayResultModel = await this.chatGatewayToProceedInChat.getChatById(requestModel.chatId);
        var errors = this.validateInput(requestModel, gatewayResultModel);
        const chatFlow = await this.chatFlowGateway.getChatFlowById(gatewayResultModel.chat.chatFlowId);
        var nextState = "";
        if (errors.length == 0) {
            nextState = await chatFlow.getNextStateId(
                requestModel.stateInput.participator1State, 
                requestModel.stateInput.participator2State,
                requestModel.stateInput.proceedEvent
            );
        }
        const result = new ProceedInChatResultModel(errors, nextState);
        await this.usecaseOutBoundary.sendResultModel(result);
    }

    private validateInput(requestModel: ProceedInChatRequestModel, gatewayResultModel: ChatGatewayCreateChatResultModel) {
        const errors: string[] = [];
        if (!gatewayResultModel.success) {
            errors.push(gatewayResultModel.error);
        }
        if (gatewayResultModel.chat !== null) {
            if (!gatewayResultModel.chat.currentState) {
                errors.push('Invalid chat current state object');
            }
            if (gatewayResultModel.chat.participator1UserId !== requestModel.userId &&
                gatewayResultModel.chat.participator2UserId !== requestModel.userId) {
                errors.push('User is not a participator in this chat');
            }
            if (gatewayResultModel.chat.currentState.participator1State !== requestModel.stateInput.participator1State) {
                errors.push('Invalid chat state for participator 1');
            } else if (gatewayResultModel.chat.currentState.participator2State !== requestModel.stateInput.participator2State) {
                errors.push('Invalid chat state for participator 2');
            } else if (gatewayResultModel.chat.currentState.proceedEvent !== requestModel.stateInput.proceedEvent) {
                errors.push('Invalid chat state event');
            }
        }
        return errors;
    }
}