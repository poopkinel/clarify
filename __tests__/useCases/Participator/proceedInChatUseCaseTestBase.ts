import ResponseValidationGateway from "../../../src/boundaries/gateways/responseValidation/responseValidationGateway";
import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";

export default class ProceedInChatUseCaseTestBase {
    usecaseOutBoundarySpy = {
        sendResultModel: jest.fn()
    }

    userIdStub = 'userId';

    chatIdStub = 'chatId';

    stubParticipator2UserId = 'userId2';

    currentStateStub = {
        participator1State: 'state',
        participator2State: 'state',
    }

    chatStub = {
        currentState: this.currentStateStub,
        participator1UserId: this.userIdStub,
        participator2UserId: this.stubParticipator2UserId,
    }

    chatGatewayResultModelStub = {
        success: true,
        chat: this.chatStub
    }

    chatGatewayStub = {
        getChatById: jest.fn().mockResolvedValue(this.chatGatewayResultModelStub)
    }

    responseOptionsStub = {
        options: [
            {
                responseMedia: 
                {
                    media: 'text'
                },
                responseRestrictions: 
                {
                    validatorId: 'validatorId'
                }   
            }
        ]
    }

    nextStateStub = {
        id: 'nextState',
        participator1State: 'state',
        participator2State: 'state',
        proceedEvent: 'event',
        participator1Options: this.responseOptionsStub,
        participator2Options: this.responseOptionsStub
    }

    nextStateResultStub = {
        success: true,
        error: '',
        nextState: this.nextStateStub
    }

    chatFlowGatewayStub = {
        getChatFlowById: jest.fn().mockResolvedValue({
            tryGetNextState: jest.fn().mockResolvedValue(this.nextStateResultStub)
        })
    }

    eventValidationResultStub = {
        success: true,
        error: '',
        event: 'event'
    }

    validationGatewayStub: ResponseValidationGateway = {
        validateResponse: jest.fn().mockResolvedValue(this.eventValidationResultStub)
    }

    requestModelStub = {
        userId: this.userIdStub,
        chatId: this.chatIdStub,
        stateInput: this.currentStateStub
    }

    usecaseStubJson = {
        usecaseOutBoundary: this.usecaseOutBoundarySpy,
        chatGatewayToProceedInChat: this.chatGatewayStub,
        chatFlowGateway: this.chatFlowGatewayStub,
        validationGateway: this.validationGatewayStub
    }

    usecaseStub = ProceedInChatUseCase.fromJson(this.usecaseStubJson);

    runTest() {
        describe('', () => {
            it('Base', () => {
                expect(true).toBe(true);
            });
        });
    }
}

new ProceedInChatUseCaseTestBase().runTest();