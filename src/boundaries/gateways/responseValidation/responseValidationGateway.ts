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
    validateResponse(response: ResponseInput): Promise<EventValidationResult>;
}