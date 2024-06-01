import ChatGatewayToProceedInChat from "../../boundaries/gateways/chat/chatGatewayToProceedInChat";
import ChatFlowGatewayToProceedInChat from "../../boundaries/gateways/chatFlow/chatFlowGatewayToProceedInChat";
import ReponseValidationGateway from "../../boundaries/gateways/responseValidation/responseValidationGateway";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ChatGatewayCreateChatResultModel from "../../dataModels/current/chatGateway/chatGatewayCreateChatResultModel";
import ProceedInChatRequestModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatRequestModel";
import ProceedInChatResultModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatResultModel";

export default class ProceedInChatUseCase {
    private usecaseOutBoundary: UsecaseOutBoundary<ProceedInChatResultModel>;
    private chatGatewayToProceedInChat: ChatGatewayToProceedInChat;
    private chatFlowGateway: ChatFlowGatewayToProceedInChat;
    private validationGateway: ReponseValidationGateway;
    constructor(
        usecaseOutBoundary: UsecaseOutBoundary<ProceedInChatResultModel>, 
        chatGatewayToProceedInChat: ChatGatewayToProceedInChat,
        chatFlowGateway: ChatFlowGatewayToProceedInChat,
        validationGateway: ReponseValidationGateway
    ) {
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.chatGatewayToProceedInChat = chatGatewayToProceedInChat;
        this.chatFlowGateway = chatFlowGateway;
        this.validationGateway = validationGateway;
    }
    async executeProceedInChat(requestModel: ProceedInChatRequestModel) {
        const gatewayResultModel = await this.chatGatewayToProceedInChat.getChatById(requestModel.chatId);
        const chatFlow = await this.chatFlowGateway.getChatFlowById(gatewayResultModel.chat.chatFlowId);

        var errors = await this.validateChatMetadata(requestModel, gatewayResultModel);
        var result: ProceedInChatResultModel;

        if (errors.length > 0) {
            result = new ProceedInChatResultModel(errors, '');
        } else {
            if (!requestModel.stateInput.response) {
                errors.push('Invalid state input response');
                result = new ProceedInChatResultModel(errors, '');
            } else {
                const response = requestModel.stateInput.response;
                const eventValidationResult = await this.validationGateway.validateResponseEvent(response);
                if (!eventValidationResult.success) {
                    errors.push(eventValidationResult.error);
                    result = new ProceedInChatResultModel(errors, '');
                } else {
                    const nextStateResult = await chatFlow.tryGetNextState(eventValidationResult.event);
                    
                    if (!nextStateResult.success) {
                        errors.push(nextStateResult.error);
                    }
                    result = new ProceedInChatResultModel(errors, nextStateResult.nextState.id);
                    result.setResponseOptions(nextStateResult.nextState.responseOptions);
                }
            }
        }
        await this.usecaseOutBoundary.sendResultModel(result);
    }

    private async validateChatMetadata(
        requestModel: ProceedInChatRequestModel, 
        gatewayResultModel: ChatGatewayCreateChatResultModel, 
    ) {
        const errors: string[] = [];
        if (!gatewayResultModel.success) {
            errors.push(gatewayResultModel.error);
        }
        if (gatewayResultModel.chat !== null) {
            const chat = gatewayResultModel.chat;
            if (!chat.currentState) {
                errors.push('Invalid chat current state object');
            }
            if (chat.participator1UserId !== requestModel.userId &&
                chat.participator2UserId !== requestModel.userId) {
                errors.push('User is not a participator in this chat');
            }
            const response = requestModel.stateInput.response;
            const eventValidationResult = await this.validationGateway.validateResponseEvent(response);
            if (!eventValidationResult.success) {
                errors.push(eventValidationResult.error);
            } else if (chat.currentState.proceedEvent !== eventValidationResult.event) {
                errors.push('Invalid chat state event');
            }
        }
        return errors;
    }

    static fromJson(json: any): ProceedInChatUseCase {
        return new ProceedInChatUseCase(
            json.usecaseOutBoundary, 
            json.chatGatewayToProceedInChat, 
            json.chatFlowGateway,
            json.validationGateway
        );
    }
}