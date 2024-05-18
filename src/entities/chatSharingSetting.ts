import ChatSharingSettingsForLink from "./chatSharingSettingsForSharingOptions";

export default class ChatSharingSetting implements ChatSharingSettingsForLink{
    canUserShare(userId: string): boolean {
        return this.userIdsWhiteList.includes(userId);
    }
    chatId: string;
    userIdsWhiteList: string[];

    constructor(chatId: string, userIdsWhiteList: string[]) {
        this.chatId = chatId;
        this.userIdsWhiteList = userIdsWhiteList;
    }

    async getLink(): Promise<string> {
        return "link";  
    }
}