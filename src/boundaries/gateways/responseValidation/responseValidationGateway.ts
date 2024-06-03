type EventValidationResult = {
    success: boolean;
    error: string;
    event: string;
}

type ResponseInput = {
    responseMedia: string;
    responseContent: string;
}

export default interface ResponseValidationGateway {
    validateResponseEvent(response: ResponseInput): Promise<EventValidationResult>;
}