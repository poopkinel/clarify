export class User {
    id: string;
    username: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, username: string, password: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}    

