import ChatSharingSettingsForSharingOptions from "./chatSharingSettingsForSharingOptions";

export default class ChatSharingSetting implements ChatSharingSettingsForSharingOptions{
    canUserShare(userId: string): boolean {
        return this.userIdsWhiteList.includes(userId);
    }
    chatId: string;
    userIdsWhiteList: string[];

    constructor(chatId: string, userIdsWhiteList: string[]) {
        this.chatId = chatId;
        this.userIdsWhiteList = userIdsWhiteList;
    }
    getSharingOptions(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve({
                option1: "Link",
                option2: "Invitation by email"
            });
        });
    }
}