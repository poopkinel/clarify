import { ResponseEntity } from "../responseEntity";
import ChatSharingSettings from "../chatSharingSetting";

export default interface ChatEntityForUserToBeParticipator {
    id: string;
    name: string;
    creatorUserId: string;
    participator2UserId: string;
    responses: ResponseEntity();
    // createdAt: Date;
    // updatedAt: Date;
    createSuccess: boolean;
    createError: string;

    sharingSettings: ChatSharingSettings;

    getLink(): Promise<string>;
}