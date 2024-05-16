// An operator creating a new user use case

import { UserGateway } from "../../boundaries/gateways/userGateway";
import WebToUsecaseBoundary from "../../boundaries/web/webToUsecaseBoundary";
import ResultModel from "../../dataModels/current/general/resultModel";
import { UserRequestModel } from "../../dataModels/v1/userRequestModel";
import { User } from "../../entities/userEntity";
import RequestModel from "../../dataModels/current/general/requestModel";

export class CreateANewUserUseCase implements WebToUsecaseBoundary {
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