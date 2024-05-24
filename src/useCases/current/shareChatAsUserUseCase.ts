import AttemptShareChatAsUserRequestModel from "../../dataModels/current/specific/shareChatAsUserRequestModel";
import UsecaseInBoundary from "../../boundaries/useCaseBoundaries/usecaseInBoundary";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ShareChatAsUserResultModel from "../../dataModels/current/specific/shareChatAsUserResultModel";
import ChatGatewayToShareChat from "../../boundaries/gateways/chatGatewayToShareChat";

export default class ShareChatAsUserUseCase implements UsecaseInBoundary<AttemptShareChatAsUserRequestModel> {
    usecaseOutBoundary: UsecaseOutBoundary<ShareChatAsUserResultModel>;
    chatGateway: ChatGatewayToShareChat;

    constructor(usecaseOutBoundary: UsecaseOutBoundary<ShareChatAsUserResultModel>,
                chatGateway: ChatGatewayToShareChat) {
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.chatGateway = chatGateway;
    }

    async sendRequestModel(requestModel: AttemptShareChatAsUserRequestModel): Promise<any> {
        await this.executeShareChat(requestModel);
    }

    async executeShareChat(requestModel: AttemptShareChatAsUserRequestModel) {
        const chat = (await this.chatGateway.getChatById(requestModel.chatId));
        var error = "";
        var link = "";
        const canShare = chat.sharingSettings.canUserShare(requestModel.userId)
        if (!canShare) {
            error = "User not authorized to share chat"
        } else {
            link = await chat.sharingSettings.getLink();
        };

        const resultModel = new ShareChatAsUserResultModel(
            "chatId", "userId", "all", error, link
        );
            
        await this.usecaseOutBoundary.sendResultModel(resultModel);
    }
}