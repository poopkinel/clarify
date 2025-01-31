// A model for the response of viewing a chat

import { ChatMessageResponseModel } from "./chatMessageResponseModel";

export class ChatViewResponseModel {
    chatId: string;
    chatName: string;
    chatMessages: ChatMessageResponseModel();

    error: string | null;

    constructor(chatId: string, chatName: string, chatMessages: ChatMessageResponseModel(), error: string | null) {
        this.chatId = chatId;
        this.chatName = chatName;
        this.chatMessages = chatMessages;
        this.error = error;
    }
}