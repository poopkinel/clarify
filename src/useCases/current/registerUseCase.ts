import UserGatewayToRegisterUser from "../../boundaries/gateways/userGatewayToRegisterUser";
import RegisterRequestModel from "../../dataModels/useCaseBoundaries/specific/registerRequestModel"
import RegisterResultModel from "../../dataModels/useCaseBoundaries/specific/registerResultModel"
import UsercaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import { UserGatewayToRegisterUserImp } from "./UserGatewayToRegisterUser";

export default class RegisterUseCase {
   private userGateway: UserGatewayToRegisterUser;
    private usecaseOutBoundary: UsercaseOutBoundary<RegisterResultModel>;

    constructor(
        userGateway: UserGatewayToRegisterUser,
                usecaseOutBoundary: UsercaseOutBoundary<RegisterResultModel>
    ) {
        this.userGateway = userGateway;
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.userGateway = new UserGatewayToRegisterUserImp();
    }

    async registerUser(request: RegisterRequestModel) {

        const gatewayResult = await this.userGateway.createUser(request.username, request.password);
        let resultModel: RegisterResultModel;
        if (gatewayResult.success == false) {
            resultModel = new RegisterResultModel(false, "", gatewayResult.error);
        } else {
            resultModel = new RegisterResultModel(gatewayResult.success, gatewayResult.user.id);
        }
        this.usecaseOutBoundary.sendResultModel(resultModel);
    }
}