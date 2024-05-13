import { UserGateway } from "../../boundaries/persistence/userGateway";
import { User } from "../../entities/userEntity";
import { UserRequestModel } from "../../dataModels/userRequestModel";


export class UserGatewayMockImpl implements UserGateway {
    async createUser(userModel: UserRequestModel): Promise<User | undefined> {
        return new User('test', 'test', 'test');
    }

    async getUserById(userId: string): Promise<User> {
        return new User('test', 'test', 'test');
    }

    async deleteUser(user: User): Promise<void> {
    }

    async updateUser(user: User): Promise<User> {
        return new User('test', 'test', 'test');
    }

    async getUserByUsername(username: string): Promise<User> {
        return new User('test', 'test', 'test');
    }
}