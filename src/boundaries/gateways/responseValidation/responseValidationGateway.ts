type EventValidationResult = {
    success: boolean;
    error: string;
    event: string;
}

type ResponseInput = {
    responseMedia: string;
    responseContent: string;
}

export default interface ReponseValidationGateway {
    validateResponseEvent(response: ResponseInput): Promise<EventValidationResult>;
}