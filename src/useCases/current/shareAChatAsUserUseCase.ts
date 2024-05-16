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

    async sendStartNewChatRequest(requestModel: ShareAChatAsUserRequestModel): Promise<any> {
        await this.shareAChatAsUser(requestModel);
    }

    async shareAChatAsUser(requestModel: ShareAChatAsUserRequestModel) {
        const responseEntities = (await this.chatGateway.getChatById(requestModel.chatId)).responses;
        console.log("responseEntities", responseEntities);
        const responses = responseEntities.map((responseEntity) => {
            return {
                text: responseEntity.text,
                onStateId: responseEntity.onStateId
            }
        });
        console.log("responses", responses);

        const resultModel = new ShareAChatAsUserResultModel("chatId", "userId", responses, "all", "error");
        await this.usecaseOutBoundary.sendStartNewChatResult(resultModel);
    }
}