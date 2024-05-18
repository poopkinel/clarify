import { ResponseEntity } from './responseEntity';
import ChatSharingSettings from './chatSharingSetting';

export class ChatEntity {
    id: string;
    name: string;
    user1: string;
    user2: string;
    responses: ResponseEntity[];
    createdAt: Date;
    updatedAt: Date;

    sharingSettings: ChatSharingSettings;

    constructor(
        id: string, 
        name: string, 
        user1: string, 
        user2: string,
        sharingSettings: ChatSharingSettings = new ChatSharingSettings(id, [])
    ) {
        this.id = id;
        this.name = name;
        this.user1 = user1;
        this.user2 = user2;
        this.responses = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.sharingSettings = sharingSettings;
    }

    ValidateLink(link: string): boolean {
        return link != '';
    }
}