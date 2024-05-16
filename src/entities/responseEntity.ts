export enum ResponseType {
    TEXT = "text",
    MULTI_CHOICE = "multi_choice"
}

export class ResponseEntity {
    id: string;
    chatId: string;
    userId: string;
    type: ResponseType;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    flowId: string;
    onStateId: string;

    constructor(id: string, 
                chatId: string, 
                userId: string, 
                type: ResponseType = ResponseType.TEXT, 
                text: string = "", 
                createdAt: Date = new Date(), 
                updatedAt: Date = new Date(),
                flowId: string = "",
                onStateId: string = ""
            ) {
        this.id = id;
        this.chatId = chatId;
        this.userId = userId;
        this.type = type;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.flowId = flowId;
        this.onStateId = onStateId;
    }
}