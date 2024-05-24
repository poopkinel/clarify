import UserEntityForRegister from "./userEntityForRegister";

export class UserEntity implements UserEntityForRegister {
    id: string;
    username: string;
    password: string;
    success: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, username: string, password: string, success: boolean = true) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.success = success;
        this.role = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}    

