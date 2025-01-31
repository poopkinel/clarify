import { ResponseEntity } from '../responseEntity';
import ChatSharingSettings from '../chatSharingSetting';
import ChatEntityForShare from './chatEntityForShare';
import ChatEntityForUserToBeParticipator from './chatEntityForUserToBeParticipator';
import ChatEntityForViewingChatHistory from './chatEntityForViewingChatHistory';
import ChatEntityForViewingChat from './chatEntityForViewingChat';
import ChatEntityForProceedInChat from './chatEntityForProceedInChat';
import ChatStateForProceedInChat from '../chatState/chatState';

export default class ChatEntity implements ChatEntityForShare, 
                                    ChatEntityForUserToBeParticipator,
                                    ChatEntityForViewingChatHistory,
                                    ChatEntityForViewingChat,
                                    ChatEntityForProceedInChat {
    id: string;
    name: string;
    creatorUserId: string;
    participator1UserId: string;
    participator2UserId: string;
    responses: ResponseEntity();
    createdAt: Date;
    updatedAt: Date;

    createSuccess: boolean;
    createError: string;

    access: string;
    sharingSettings: ChatSharingSettings;

    chatFlowId: string;
    currentStateId: string;

    isEnded: boolean;

    constructor(
        id: string, 
        name: string, 
        user1: string, 
        user2: string,

        createSuccess: boolean,
        createError: string = '',

        access: string = '',
        sharingSettings: ChatSharingSettings = new ChatSharingSettings(id, ()),

        chatFlowId: string = '',
        currentStateId: string = '',

        isEnded: boolean = false
    ) {
        this.id = id;
        this.name = name;
        this.creatorUserId = user1;
        this.participator1UserId = user1;
        this.participator2UserId = user2;
        this.responses = ();
        this.createdAt = new Date();
        this.updatedAt = new Date();

        this.createSuccess = createSuccess;
        this.createError = createError;

        this.access = access;
        this.sharingSettings = sharingSettings;

        this.chatFlowId = chatFlowId;
        this.currentStateId = currentStateId;

        this.isEnded = isEnded;
    }

    public static fromJson(json: any): ChatEntity {
        return new ChatEntity(
            json.id,
            json.name,
            json.participator1UserId,
            json.participator2UserId,
            json.createSuccess,
            json.createError,
            json.access,
            json.sharingSettings,
            json.chatFlowId,
            json.currentState,
            json.isEnded
        );
    }

    setCurrentState(newCurrentStateId: string): void {
        this.currentStateId = newCurrentStateId ;
    }


    getLink(): Promise<string> {
        return this.sharingSettings.getLink();
    }

    ValidateLink(link: string): boolean {
        return link != '';
    }
}