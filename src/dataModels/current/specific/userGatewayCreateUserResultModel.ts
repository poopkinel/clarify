import UserEntityForRegister from "../../../entities/userEntity/userEntityForRegister";
import UserGatewayResultModel from "../general/userGatewayResultModel";

export default class UserGatewayCreateUserResultModel implements UserGatewayResultModel {
    user: UserEntityForRegister;
    success: boolean;
    error: string;

    constructor(user: UserEntityForRegister, success: boolean, error: string = '') {
        this.user = user;
        this.success = success;
        this.error = error;
    }
}