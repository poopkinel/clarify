// Use case for a person looking to register as a user in the system

import { UserGateway } from "../boundaries/persistence/userGateway";
import WebToUsecaseBoundary from "../boundaries/web/webToUsecaseBoundary";
import ResultModel from "../dataModels/resultModel";
import { UserRequestModel } from "../dataModels/userRequestModel";
import { User } from "../entities/userEntity";
import RequestModel from "../dataModels/requestModel";

export class PersonRegistersAsUserUseCase implements WebToUsecaseBoundary {
    userGateway: UserGateway;

    constructor(userGateway: UserGateway) {
        this.userGateway = userGateway;
    }
    
    async sendStartNewChatRequest(requestModel: RequestModel): Promise<any> {
        throw new Error("Method not implemented.");
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

    async sendUserRequest(userModel: UserRequestModel): Promise<any> {
        return await this.execute(userModel);
    }
}