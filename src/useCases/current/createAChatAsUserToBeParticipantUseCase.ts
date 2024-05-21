import ChatGatewayToCreateChatToBeParticipant from '../../boundaries/gateways/chatGatewayToCreateChatToBeParticipant';
import UsecaseOutBoundary from '../../boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateAChatAsUserToBeParticipantRequestModel from '../../dataModels/current/specific/createAChatAsUserToBeParticipantRequestModel';
import CreateAChatAsUserToBeParticipantResultModel from '../../dataModels/current/specific/createAChatAsUserToBeParticipantResultModel';

export default class CreateAChatAsUserToBeParticipantUseCase {
    chatGateway: ChatGatewayToCreateChatToBeParticipant;
    usecaseOutBoundary: UsecaseOutBoundary<CreateAChatAsUserToBeParticipantResultModel>;

    constructor(chatGateway: ChatGatewayToCreateChatToBeParticipant, 
        usecaseOutBoundary: UsecaseOutBoundary<CreateAChatAsUserToBeParticipantResultModel>) {
        this.chatGateway = chatGateway;
        this.usecaseOutBoundary = usecaseOutBoundary;
    }

    async executeCreateChatToBeParticipant(requestModel: CreateAChatAsUserToBeParticipantRequestModel) {
        const chat = await this.chatGateway.createChatToBeParticipant(requestModel.chatName, requestModel.userId);
        this.usecaseOutBoundary.sendResultModel(new CreateAChatAsUserToBeParticipantResultModel(
            chat.id,
            await chat.sharingSettings.getLink(),
            await chat.sharingSettings.getLink()
        ));
    }
}