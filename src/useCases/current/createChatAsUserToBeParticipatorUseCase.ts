import ChatGatewayToCreateChatToBeParticipator from '../../boundaries/gateways/chatGatewayToCreateChatToBeParticipator';
import UsecaseOutBoundary from '../../boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateChatAsUserToBeParticipatorRequestModel from '../../dataModels/current/specific/createChatAsUserToBeParticipatorRequestModel';
import CreateChatAsUserToBeParticipatorResultModel from '../../dataModels/current/specific/createChatAsUserToBeParticipatorResultModel';

export default class CreateAChatAsUserToBeParticipatorUseCase {
    chatGateway: ChatGatewayToCreateChatToBeParticipator;
    usecaseOutBoundary: UsecaseOutBoundary<CreateChatAsUserToBeParticipatorResultModel>;

    constructor(chatGateway: ChatGatewayToCreateChatToBeParticipator, 
        usecaseOutBoundary: UsecaseOutBoundary<CreateChatAsUserToBeParticipatorResultModel>) {
        this.chatGateway = chatGateway;
        this.usecaseOutBoundary = usecaseOutBoundary;
    }

    async executeCreateChatToBeParticipator(requestModel: CreateChatAsUserToBeParticipatorRequestModel) {
        const chat = await this.chatGateway.createChatToBeParticipator(requestModel.chatName, requestModel.userId);
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