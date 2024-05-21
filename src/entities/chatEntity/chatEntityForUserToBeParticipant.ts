import { ResponseEntity } from "../responseEntity";
import ChatSharingSettings from "../chatSharingSetting";

export default interface ChatEntityForUserToBeParticipant {
    id: string;
    name: string;
    user1: string;
    user2: string;
    responses: ResponseEntity[];
    // createdAt: Date;
    // updatedAt: Date;

    sharingSettings: ChatSharingSettings;

    getLink(): Promise<string>;
}