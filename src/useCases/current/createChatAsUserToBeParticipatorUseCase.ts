import ChatGatewayToCreateChatToBeParticipator from '../../boundaries/gateways/chat/chatGatewayToCreateChatToBeParticipator';
import UsecaseOutBoundary from '../../boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateChatAsUserToBeParticipatorRequestModel from '../../dataModels/useCaseBoundaries/specific/createChatAsUserToBeParticipatorRequestModel';
import CreateChatAsUserToBeParticipatorResultModel from '../../dataModels/useCaseBoundaries/specific/createChatAsUserToBeParticipatorResultModel';

export default class CreateChatAsUserToBeParticipatorUseCase {
    chatGateway: ChatGatewayToCreateChatToBeParticipator;
    usecaseOutBoundary: UsecaseOutBoundary<CreateChatAsUserToBeParticipatorResultModel>;

    constructor(chatGateway: ChatGatewayToCreateChatToBeParticipator, 
        usecaseOutBoundary: UsecaseOutBoundary<CreateChatAsUserToBeParticipatorResultModel>) {
        this.chatGateway = chatGateway;
        this.usecaseOutBoundary = usecaseOutBoundary;
    }

    async executeCreateChatToBeParticipator(requestModel: CreateChatAsUserToBeParticipatorRequestModel) {
        const chat = await this.chatGateway.createChatToBeParticipator(
            requestModel.chatName, requestModel.userId, requestModel.flowId);
        let result;
        if (chat.createSuccess) {
            result = new CreateChatAsUserToBeParticipatorResultModel(
                chat.creatorUserId,
                true,
                chat.id,
                await chat.sharingSettings.getLink(),
                await chat.sharingSettings.getLink(),
                ''
            );
        } else {
            result = new CreateChatAsUserToBeParticipatorResultModel(
                chat.creatorUserId,
                false,
                '',
                '',
                '',
                'Error creating chat'
            );
        }
        this.usecaseOutBoundary.sendResultModel(result);
    }
}