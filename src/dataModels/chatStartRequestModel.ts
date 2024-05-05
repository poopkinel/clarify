export class ChatStartRequestModel {
    userId: string;
    chatName: string;

    constructor(userId: string, chatName: string) {
        this.userId = userId;
        this.chatName = chatName;
    }
}