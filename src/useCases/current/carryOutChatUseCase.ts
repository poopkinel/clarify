import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import CarryOutChatRequestModel from "../../dataModels/useCaseBoundaries/specific/carryOutChatRequestModel";
import CarryOutChatResultModel from "../../dataModels/useCaseBoundaries/specific/carryOutChatResultModel";

export default class CarryOutChatUseCase {
    private usecaseOutBoundary: UsecaseOutBoundary<CarryOutChatResultModel>;

    constructor(usecaseOutBoundary: UsecaseOutBoundary<CarryOutChatResultModel>) {
        this.usecaseOutBoundary = usecaseOutBoundary;
    }

    async executeCarryOutChat(requestModel: CarryOutChatRequestModel) {
        const result = new CarryOutChatResultModel('', '', '', (), true, '', '', '');
        await this.usecaseOutBoundary.sendResultModel(result);
    }
}