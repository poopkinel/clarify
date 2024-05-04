import { ResponseEntity } from './responseEntity';

export class ChatEntity {
    id: string;
    name: string;
    user1: string;
    user2: string;
    responses: ResponseEntity[];
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, name: string, user1: string, user2: string) {
        this.id = id;
        this.name = name;
        this.user1 = user1;
        this.user2 = user2;
        this.responses = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}