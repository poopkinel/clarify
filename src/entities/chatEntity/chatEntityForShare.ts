import ChatSharingSetting from "../chatSharingSetting";

export default interface ChatEntityForShare {
    id: string;
    sharingSettings: ChatSharingSetting;
};