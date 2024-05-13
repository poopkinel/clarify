export class ChatStartRequestModel {
    username: string;
    chatName: string;

    constructor(userId: string, chatName: string) {
        this.username = userId;
        this.chatName = chatName;
    }
}