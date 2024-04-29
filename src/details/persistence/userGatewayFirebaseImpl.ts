import { UserGateway } from "../../boundaries/userGateway";
import { User } from "../../entities/userEntity";
import { UserRequestModel } from "../../dataModels/userRequestModel";

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

    async createUser(userModel: UserRequestModel): Promise<User | undefined> {
        const adjustedUsername = this.adjustUsername(userModel.username);
        let user;

        await auth.createUser(
            {
                email: adjustedUsername,
                emailVerified: false,
                password: userModel.password,
                displayName: '',
                disabled: false
            }
        )
        .then((userRecord) => {
            user = new User(
                userRecord.uid,
                userModel.username,
                userRecord.password
            );
        })
        .catch((error) => {
            console.error('Error creating new user:', error);
        });
        
        return user;
    }
    async getUserById(id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async getUserByUsername(username: string): Promise<User> {
        throw new Error("Method not implemented.");
    }   
    async updateUser(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async deleteUser(user: User): Promise<void> {
        const adjustedUsername = this.adjustUsername(user.username);

        await auth.getUserByEmail(adjustedUsername)
            .then((userRecord) => {
                const uid = userRecord.uid;
                auth.deleteUser(uid);
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    }
}