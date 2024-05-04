// Use case for a person looking to register as a user in the system

import { UserGateway } from "../boundaries/persistence/userGateway";
import { UserRequestModel } from "../dataModels/userRequestModel";
import { User } from "../entities/userEntity";

export class PersonRegistersAsUserUseCase {
    userGateway: UserGateway;

    constructor(userGateway: UserGateway) {
        this.userGateway = userGateway;
    }

    async execute(userModel: UserRequestModel) : Promise<User | undefined> {
        const model = await this.userGateway.createUser(userModel);
        if (model === undefined) {
            return undefined;
        }
        const user = new User(
            model.id,
            model.username,
            model.password
        );
        return user;
    }
}