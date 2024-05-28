import { UserGateway } from "../../../boundaries/gateways/userGateway";
import { UserEntity } from "../../../entities/userEntity/userEntity";
import { UserRequestModel } from "../../../dataModels/v1/userRequestModel";
import UserGatewayResultModel from "../../../dataModels/current/userGateway/userGatewayResultModel";
import UserGatewayCreateUserResultModel from "../../../dataModels/current/userGateway/userGatewayCreateUserResultModel";

const admin = require("firebase-admin");
var serviceAccount = require("../../../sak.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

require('dotenv').config();
const auth = admin.auth();


export class UserGatewayFirebaseImpl implements UserGateway {
    adjustUsername = (username: string) => {
        if (username.includes('@clarifymock.com')) {
            return username.replace('@clarifymock.com', '');
        }
        else
        {
            return `${username}@clarifymock.com`;
        }
    }

    async createUser(username: string, password: string): Promise<UserGatewayCreateUserResultModel> {
        const adjustedUsername = this.adjustUsername(username);
        let user;

        await auth.createUser(
            {
                email: adjustedUsername,
                emailVerified: false,
                password: password,
                displayName: '',
                disabled: false
            }
        )
        .then((userRecord: any) => {
            user = new UserEntity(
                userRecord.uid,
                username,
                userRecord.password,
            );
        })
        .catch((error: any) => {
            console.error('Error creating new user:', error);
        });
        
        if (!user) {
            return new UserGatewayCreateUserResultModel(new UserEntity("", "", "", false), false, 'Error creating new user');
        }

        return new UserGatewayCreateUserResultModel(user, true, '');
    }
    async getUserById(id: string): Promise<UserEntity> {
        try {
            const userRecord = await auth.getUser(id);
            return new UserEntity(
                userRecord.uid,
                userRecord.email,
                userRecord.password
            );
        } catch (error) {
            throw new Error("User not found");
        }
    }
    async getUserByUsername(username: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }   
    async updateUser(user: UserEntity): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }
    async deleteUser(user: UserEntity): Promise<void> {
        const adjustedUsername = this.adjustUsername(user.username);

        await auth.getUserByEmail(adjustedUsername)
            .then((userRecord: any) => {
                const uid = userRecord.uid;
                auth.deleteUser(uid);
            })
            .catch((error: any) => {
                console.error('Error deleting user:', error);
            });
    }
}