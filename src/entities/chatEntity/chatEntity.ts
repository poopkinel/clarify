import { ResponseEntity } from '../responseEntity';
import ChatSharingSettings from '../chatSharingSetting';
import ChatEntityForShare from './chatEntityForShare';
import ChatEntityForUserToBeParticipator from './chatEntityForUserToBeParticipator';
import ChatEntityForViewingChatHistory from './chatEntityForViewingChatHistory';
import ChatEntityForViewingChat from './chatEntityForViewingChat';

export class ChatEntity implements ChatEntityForShare, 
                                    ChatEntityForUserToBeParticipator,
                                    ChatEntityForViewingChatHistory,
                                    ChatEntityForViewingChat {
    id: string;
    name: string;
    creatorUserId: string;
    participator1UserId: string;
    participator2UserId: string;
    responses: ResponseEntity[];
    createdAt: Date;
    updatedAt: Date;

    createSuccess: boolean;
    createError: string;

    sharingSettings: ChatSharingSettings;

    constructor(
        id: string, 
        name: string, 
        user1: string, 
        user2: string,

        createSuccess: boolean,
        createError: string = '',

        sharingSettings: ChatSharingSettings = new ChatSharingSettings(id, []),
    ) {
        this.id = id;
        this.name = name;
        this.creatorUserId = user1;
        this.participator1UserId = user1;
        this.participator2UserId = user2;
        this.responses = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();

        this.createSuccess = createSuccess;
        this.createError = createError;

        this.sharingSettings = sharingSettings;
    }

    getLink(): Promise<string> {
        return this.sharingSettings.getLink();
    }

    ValidateLink(link: string): boolean {
        return link != '';
    }
}