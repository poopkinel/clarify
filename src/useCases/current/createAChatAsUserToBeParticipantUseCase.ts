import ChatGatewayToCreateChatToBeParticipant from '../../boundaries/gateways/chatGatewayToCreateChatToBeParticipant';
import UsecaseOutBoundary from '../../boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateAChatAsUserToBeParticipantRequestModel from '../../dataModels/current/specific/createAChatAsUserToBeParticipantRequestModel';

export default class CreateAChatAsUserToBeParticipantUseCase {
    chatGateway: ChatGatewayToCreateChatToBeParticipant;
    usecaseOutBoundary: UsecaseOutBoundary<CreateAChatAsUserToBeParticipantRequestModel>;

    constructor(chatGateway: ChatGatewayToCreateChatToBeParticipant, 
        usecaseOutBoundary: UsecaseOutBoundary<CreateAChatAsUserToBeParticipantRequestModel>) {
        this.chatGateway = chatGateway;
        this.usecaseOutBoundary = usecaseOutBoundary;
    }

    executeCreateChatToBeParticipant(userId: string, chatName: string) {
        // this.chatGateway.createChatToBeParticipant(userId, chatName);
        this.usecaseOutBoundary.sendResultModel(new CreateAChatAsUserToBeParticipantRequestModel(userId, chatName));
    }
}