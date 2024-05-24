import { ResponseEntity } from "../responseEntity";

export default interface ChatEntityForViewingChat {
    id: string;
    name: string;
    participator1UserId: string;
    participator2UserId: string;
    access: string;
    error: string;
    responses: ResponseEntity[];
}