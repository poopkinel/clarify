import UserGatewayCreateUserResultModel from "../../dataModels/current/userGateway/userGatewayCreateUserResultModel";

export const nextResponse: UserGatewayCreateUserResultModel = {
    user: {id: 'a', success: true},
    success: false,
    error: ""
};

export class UserGatewayToRegisterUserImp {

    public async createUser(username: string, password: string): Promise<UserGatewayCreateUserResultModel> {
        return nextResponse;
    }
}