export enum ResponseType {
    TEXT = "text",
    MULTI_CHOICE = "multi_choice"
}

export class ResponseEntity {
    id: string;
    chatId: string;
    userId: string;
    type: ResponseType;
    message: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, chatId: string, userId: string, type: ResponseType, message: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.chatId = chatId;
        this.userId = userId;
        this.type = type;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}