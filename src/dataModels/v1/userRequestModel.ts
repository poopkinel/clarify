import RequestModel from '../useCaseBoundaries/general/requestModel';

export class UserRequestModel implements RequestModel {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}