import ChatGatewayToProceedInChat from "../../boundaries/gateways/chatGatewayToProceedInChat";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
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
        var errors: string[] = [];
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
            if(gatewayResultModel.chat.currentState.participator1 !== requestModel.stateInput.stateParticipator1){
                errors.push('Invalid chat state for participator');
            } else if (gatewayResultModel.chat.currentState.participator2 !== requestModel.stateInput.stateParticipator2) {
                errors.push('Invalid chat state for participator');
            }
        }
        const result = new ProceedInChatResultModel(errors);
        await this.usecaseOutBoundary.sendResultModel(result);
    }
}