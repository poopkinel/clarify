import { User } from "../../entities/userEntity";
import { UserRequestModel } from "../../dataModels/v1/userRequestModel";
import { UserResponseModel } from "../../dataModels/v1/userResponseModel";

export interface UserGateway {
    createUser(userModel: UserRequestModel) : Promise<User | undefined>;
    getUserById(id: string): Promise<User>;
    getUserByUsername(username: string): Promise<User>;
    updateUser(user: User): Promise<User>;
    deleteUser(user: User): Promise<void>;
}