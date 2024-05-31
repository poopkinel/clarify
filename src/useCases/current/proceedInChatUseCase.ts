import ChatGatewayToProceedInChat from "../../boundaries/gateways/chat/chatGatewayToProceedInChat";
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
        const chatFlow = await this.chatFlowGateway.getChatFlowById(gatewayResultModel.chat.chatFlowId);

        var errors = this.validateInput(requestModel, gatewayResultModel);
        var result: ProceedInChatResultModel;

        if (errors.length > 0) {
            result = new ProceedInChatResultModel(errors, '');
        } else {
            const nextStateResult = await chatFlow.tryGetNextState(requestModel.stateInput.proceedEvent);
            
            if (!nextStateResult.success) {
                errors.push(nextStateResult.error);
            }
            result = new ProceedInChatResultModel(errors, nextStateResult.nextState.id);
            result.setResponseOptions(nextStateResult.nextState.responseOptions);
        }
        await this.usecaseOutBoundary.sendResultModel(result);
    }

    private validateInput(
        requestModel: ProceedInChatRequestModel, 
        gatewayResultModel: ChatGatewayCreateChatResultModel, 
    ) {
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
            if (gatewayResultModel.chat.currentState.proceedEvent !== requestModel.stateInput.proceedEvent) {
                errors.push('Invalid chat state event');
            }
        }
        return errors;
    }

    static fromJson(json: any): ProceedInChatUseCase {
        return new ProceedInChatUseCase(json.usecaseOutBoundary, json.chatGatewayToProceedInChat, json.chatFlowGateway);
    }
}