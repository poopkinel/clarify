export default class ChatStartResultModel {
    chatId: string;
    chatName: string;
    error: string;
    username: string;

    constructor(chatId: string, chatName: string, username: string, error: string) {
        this.chatId = chatId;
        this.chatName = chatName;
        this.error = error;
        this.username = username;
    }
}