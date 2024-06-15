import ResponseValidationGateway from "../../src/boundaries/gateways/responseValidation/responseValidationGateway";

export default class ValidationGatewayMock implements ResponseValidationGateway {
    constructor(
        private eventValidationResultStub: any,

        private firstSetupData: any,
        private secondSetupData: any,
    ) { }

    requestIndex = 0;

    async validateResponse(
        response: { responseMedia: string; responseContent: string; }
    ): Promise<{ success: boolean; error: string; event: string; }> {
        if (this.requestIndex === 0) {
            this.requestIndex++;
            return {
                ...this.eventValidationResultStub,
                success: this.firstSetupData.validateResultSuccess,
                error: this.firstSetupData.validateResultError,
                event: this.firstSetupData.validatedEvent
            }
        } else {
            return {
                ...this.eventValidationResultStub,
                success: this.secondSetupData.validateResultSuccess,
                error: this.secondSetupData.validateResultError,
                event: this.secondSetupData.validatedEvent
            }
        }
    }
    
    resetRequestIndex = () => {
        this.requestIndex = 0;
    }
}