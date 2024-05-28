// Use case for a person looking to register as a user in the system

import { UserGateway } from "../../boundaries/gateways/userGateway";
import WebToUsecaseBoundary from "../../boundaries/web/webToUsecaseBoundary";
import ResultModel from "../../dataModels/useCaseBoundaries/general/resultModel";
import { UserRequestModel } from "../../dataModels/v1/userRequestModel";
import { UserEntity } from "../../entities/userEntity/userEntity";
import RequestModel from "../../dataModels/useCaseBoundaries/general/requestModel";

export class PersonRegistersAsUserUseCase implements WebToUsecaseBoundary {
    userGateway: UserGateway;

    constructor(userGateway: UserGateway) {
        this.userGateway = userGateway;
    }
    
    async sendStartNewChatRequest(requestModel: RequestModel): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async execute(userModel: UserRequestModel) : Promise<void> {
        const model = await this.userGateway.createUser(userModel.username, userModel.password);
        if (model === undefined) {
            return undefined;
        }
    }

    async sendUserRequest(userModel: UserRequestModel): Promise<any> {
        return await this.execute(userModel);
    }
}