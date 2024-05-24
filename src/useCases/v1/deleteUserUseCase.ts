import { UserGateway } from "../../boundaries/gateways/userGateway";
import { UserEntity } from "../../entities/userEntity/userEntity";

export class DeleteUserUseCase {
    userGateway: UserGateway;

    constructor(userGateway: UserGateway) {
        this.userGateway = userGateway;
    }

    async execute(user: UserEntity) : Promise<void> {
        await this.userGateway.deleteUser(user);
    }
}