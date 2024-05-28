import ChatGatewayToProceedInChat from "../../boundaries/gateways/chatGatewayToProceedInChat";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ChatGatewayCreateChatResultModel from "../../dataModels/current/chatGateway/chatGatewayCreateChatResultModel";
import ProceedInChatRequestModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatRequestModel";
import ProceedInChatResultModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatResultModel";

export default class ProceedInChatUseCase {
    private usecaseOutBoundary: UsecaseOutBoundary<ProceedInChatResultModel>;
    private chatGatewayToProceedInChat: ChatGatewayToProceedInChat;
    constructor(
        usecaseOutBoundary: UsecaseOutBoundary<ProceedInChatResultModel>, 
        chatGatewayToProceedInChat: ChatGatewayToProceedInChat
    ) {
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.chatGatewayToProceedInChat = chatGatewayToProceedInChat;
    }
    async executeProceedInChat(requestModel: ProceedInChatRequestModel) {
        const gatewayResultModel = await this.chatGatewayToProceedInChat.getChatById(requestModel.chatId);
        var errors = this.validateInput(requestModel, gatewayResultModel);
        const result = new ProceedInChatResultModel(errors);
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