import UserGatewayCreateUserResultModel from "../../dataModels/current/userGateway/userGatewayCreateUserResultModel";

export default interface UserGatewayToRegisterUser {
    createUser(username: string, password: string): Promise<UserGatewayCreateUserResultModel>;
};