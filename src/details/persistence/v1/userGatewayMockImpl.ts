import { UserGateway } from "../../../boundaries/gateways/userGateway";
import { UserEntity } from "../../../entities/userEntity/userEntity";
import { UserRequestModel } from "../../../dataModels/v1/userRequestModel";
import UserGatewayCreateUserResultModel from "../../../dataModels/current/userGateway/userGatewayCreateUserResultModel";

export class UserGatewayMockImpl implements UserGateway {
    async createUser(username: string, password: string): Promise<UserGatewayCreateUserResultModel> {
        const user = new UserEntity('test', 'test', 'test');
        return new UserGatewayCreateUserResultModel(user, true, '');
    }

    async getUserById(userId: string): Promise<UserEntity> {
        return new UserEntity('test', 'test', 'test');
    }

    async deleteUser(user: UserEntity): Promise<void> {
    }

    async updateUser(user: UserEntity): Promise<UserEntity> {
        return new UserEntity('test', 'test', 'test');
    }

    async getUserByUsername(username: string): Promise<UserEntity> {
        return new UserEntity('test', 'test', 'test');
    }
}