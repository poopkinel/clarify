import ShareAChatAsUserRequestModel from "../../dataModels/current/specific/shareAChatAsUserRequestModel";
import UsecaseInBoundary from "../../boundaries/useCaseBoundaries/usecaseInBoundary";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ShareAChatAsUserResultModel from "../../dataModels/current/specific/shareAChatAsUserResultModel";

export default class ShareAChatAsUserUseCase {
    usecaseInBoundary: UsecaseInBoundary<ShareAChatAsUserRequestModel>;
    usecaseOutBoundary: UsecaseOutBoundary<ShareAChatAsUserResultModel>;

    constructor(usecaseInBoundary: UsecaseInBoundary<ShareAChatAsUserRequestModel>, 
                usecaseOutBoundary: UsecaseOutBoundary<ShareAChatAsUserResultModel>) {
        this.usecaseInBoundary = usecaseInBoundary;
        this.usecaseOutBoundary = usecaseOutBoundary;
    }

    async shareAChatAsUser(requestModel: ShareAChatAsUserRequestModel) {
        const resultModel = new ShareAChatAsUserResultModel("chatId", "userId", "all", "error");
        await this.usecaseOutBoundary.sendStartNewChatRequest(resultModel);
    }
}