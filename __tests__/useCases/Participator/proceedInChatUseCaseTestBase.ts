export default class ProceedInChatUseCaseTestBase {
    usecaseOutBoundarySpy = {
        sendResultModel: jest.fn()
    }

    userIdStub = 'userId';

    currentStateStub = {
        participator1State: 'state',
        participator2State: 'state',
        proceedEvent: 'event'
    }

    chatStub = {
        currentState: this.currentStateStub,
        participator1UserId: this.userIdStub,
        participator2UserId: 'userId2',
    }

    chatGatewayResultModelStub = {
        success: true,
        chat: this.chatStub
    }

    chatGatewayStub = {
        getChatById: jest.fn().mockResolvedValue(this.chatGatewayResultModelStub)
    }

    responseOptionsStub = {
        responseOptionsParticipant1: [],
        responseOptionsParticipant2: []
    }

    nextStateStub = {
        id: 'nextState',
        participator1State: 'state',
        participator2State: 'state',
        proceedEvent: 'event',
        responseOptions: this.responseOptionsStub
    }

    nextStateResultStub = {
        success: true,
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

    validationGatewayStub = {
        validateResponseEvent: jest.fn().mockResolvedValue(this.eventValidationResultStub)
    }
}