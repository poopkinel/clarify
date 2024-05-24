import UserGatewayCreateUserResultModel from "../../dataModels/current/specific/userGatewayCreateUserResultModel";

export default interface UserGatewayToRegisterUser {
    createUser(username: string, password: string): Promise<UserGatewayCreateUserResultModel>;
};