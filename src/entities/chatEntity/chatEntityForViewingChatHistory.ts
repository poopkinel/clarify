import { ResponseEntity } from "../responseEntity";

export default interface ChatEntityForViewingChatHistory {
    id: string;
    participator1UserId: string;
    participator2UserId: string;
    responses: ResponseEntity();
}