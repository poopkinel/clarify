export class UserResponseModel {
    id: string;
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.id = "TestID";
        this.username = username;
        this.password = password;
    }
}