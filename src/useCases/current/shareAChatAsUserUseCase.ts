import AttemptShareAChatAsUserRequestModel from "../../dataModels/current/specific/shareAChatAsUserRequestModel";
import UsecaseInBoundary from "../../boundaries/useCaseBoundaries/usecaseInBoundary";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ShareAChatAsUserResultModel from "../../dataModels/current/specific/shareAChatAsUserResultModel";
import ChatGateway from "../../boundaries/gateways/chatGateway";

export default class ShareAChatAsUserUseCase implements UsecaseInBoundary<AttemptShareAChatAsUserRequestModel> {
    usecaseOutBoundary: UsecaseOutBoundary<ShareAChatAsUserResultModel>;
    chatGateway: ChatGateway;

    constructor(usecaseOutBoundary: UsecaseOutBoundary<ShareAChatAsUserResultModel>,
                chatGateway: ChatGateway) {
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.chatGateway = chatGateway;
    }

    async sendRequestModel(requestModel: AttemptShareAChatAsUserRequestModel): Promise<any> {
        await this.executeShareChat(requestModel);
    }

    async executeShareChat(requestModel: AttemptShareAChatAsUserRequestModel) {
        const chat = (await this.chatGateway.getChatById(requestModel.chatId));
        var error = "";
        var link = "";
        const canShare = chat.sharingSettings.canUserShare(requestModel.userId)
        if (!canShare) {
            error = "User not authorized to share chat"
        } else {
            link = await chat.sharingSettings.getLink();
        };

        const resultModel = new ShareAChatAsUserResultModel(
            "chatId", "userId", "all", error, link
        );
            
        await this.usecaseOutBoundary.sendResultModel(resultModel);
    }
}