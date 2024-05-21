import ChatGatewayToCreateChatToBeParticipator from '../../boundaries/gateways/chatGatewayToCreateChatToBeParticipator';
import UsecaseOutBoundary from '../../boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateAChatAsUserToBeParticipatorRequestModel from '../../dataModels/current/specific/createAChatAsUserToBeParticipatorRequestModel';
import CreateAChatAsUserToBeParticipatorResultModel from '../../dataModels/current/specific/createAChatAsUserToBeParticipatorResultModel';

export default class CreateAChatAsUserToBeParticipatorUseCase {
    chatGateway: ChatGatewayToCreateChatToBeParticipator;
    usecaseOutBoundary: UsecaseOutBoundary<CreateAChatAsUserToBeParticipatorResultModel>;

    constructor(chatGateway: ChatGatewayToCreateChatToBeParticipator, 
        usecaseOutBoundary: UsecaseOutBoundary<CreateAChatAsUserToBeParticipatorResultModel>) {
        this.chatGateway = chatGateway;
        this.usecaseOutBoundary = usecaseOutBoundary;
    }

    async executeCreateChatToBeParticipator(requestModel: CreateAChatAsUserToBeParticipatorRequestModel) {
        const chat = await this.chatGateway.createChatToBeParticipator(requestModel.chatName, requestModel.userId);
        let result;
        if (chat.createSuccess) {
            result = new CreateAChatAsUserToBeParticipatorResultModel(
                chat.creatorUserId,
                true,
                chat.id,
                await chat.sharingSettings.getLink(),
                await chat.sharingSettings.getLink(),
                ''
            );
        } else {
            result = new CreateAChatAsUserToBeParticipatorResultModel(
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