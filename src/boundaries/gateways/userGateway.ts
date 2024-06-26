import { UserEntity } from "../../entities/userEntity/userEntity";
import UserGatewayToRegisterUser from "./userGatewayToRegisterUser";
import UserGatewayCreateUserResultModel from "../../dataModels/current/userGateway/userGatewayCreateUserResultModel";

export interface UserGateway extends UserGatewayToRegisterUser { // this will become an impl class, and "UserGateway" will be an interface
    createUser(username: string, password: string) : Promise<UserGatewayCreateUserResultModel>;
    getUserById(id: string): Promise<UserEntity>;
    getUserByUsername(username: string): Promise<UserEntity>;
    updateUser(user: UserEntity): Promise<UserEntity>;
    deleteUser(user: UserEntity): Promise<void>;
}