export default class ChatStartResultModel {
    private chatId: string;
    private chatName: string;
    private error: string;

    constructor(chatId: string, chatName: string, error: string) {
        this.chatId = chatId;
        this.chatName = chatName;
        this.error = error;
    }
}