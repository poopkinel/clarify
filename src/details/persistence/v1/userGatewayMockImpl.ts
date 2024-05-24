import { UserGateway } from "../../../boundaries/gateways/userGateway";
import { UserEntity } from "../../../entities/userEntity/userEntity";
import { UserRequestModel } from "../../../dataModels/v1/userRequestModel";


export class UserGatewayMockImpl implements UserGateway {
    async createUser(userModel: UserRequestModel): Promise<UserEntity | undefined> {
        return new UserEntity('test', 'test', 'test');
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