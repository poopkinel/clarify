import ShareAChatAsUserRequestModel from "../../dataModels/current/specific/shareAChatAsUserRequestModel";
import UsecaseInBoundary from "../../boundaries/useCaseBoundaries/usecaseInBoundary";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ShareAChatAsUserResultModel from "../../dataModels/current/specific/shareAChatAsUserResultModel";
import ChatGateway from "../../boundaries/gateways/chatGateway";

export default class ShareAChatAsUserUseCase implements UsecaseInBoundary<ShareAChatAsUserRequestModel> {
    usecaseOutBoundary: UsecaseOutBoundary<ShareAChatAsUserResultModel>;
    chatGateway: ChatGateway;

    constructor(usecaseOutBoundary: UsecaseOutBoundary<ShareAChatAsUserResultModel>,
                chatGateway: ChatGateway) {
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.chatGateway = chatGateway;
    }

    async sendRequestModel(requestModel: ShareAChatAsUserRequestModel): Promise<any> {
        await this.shareAChatAsUser(requestModel);
    }

    async shareAChatAsUser(requestModel: ShareAChatAsUserRequestModel) {
        const chat = (await this.chatGateway.getChatById(requestModel.chatId));
        var error = "";
        const canShare = chat.sharingSettings.canUserShare(requestModel.userId)
        if (!canShare) {
            error = "User not authorized to share chat";
        }
        const responseEntities = chat.responses;
        const sharingOptions = await chat.sharingSettings.getSharingOptions();
        const responses = responseEntities.map((responseEntity) => {
            return {
                text: responseEntity.text,
                onStateId: responseEntity.onStateId
            }
        });

        const resultModel = new ShareAChatAsUserResultModel(
            "chatId", "userId", responses, "all", error, sharingOptions);
        await this.usecaseOutBoundary.sendResultModel(resultModel);
    }
}