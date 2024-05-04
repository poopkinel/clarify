import { UserGateway } from "../boundaries/persistence/userGateway";
import { User } from "../entities/userEntity";

export class DeleteUserUseCase {
    userGateway: UserGateway;

    constructor(userGateway: UserGateway) {
        this.userGateway = userGateway;
    }

    async execute(user: User) : Promise<void> {
        await this.userGateway.deleteUser(user);
    }
}