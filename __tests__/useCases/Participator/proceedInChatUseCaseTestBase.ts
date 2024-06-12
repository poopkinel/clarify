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

    chatFlowGatewayStub_OLD = {
        getChatFlowById: jest.fn().mockResolvedValue({
            tryGetNextState: jest.fn().mockResolvedValue(this.nextStateResultStub)
        })
    }

    participatorFlowStub = {
        participatorId: 1,
        states: [
            {
                id: 'stateId',
            }
        ],
        transitions: [
            {
                fromStateId: 'stateId',
                toStateId: 'nextStateId',
                event: 'event'
            }
        ]
    }

    chatFlowGatewayStub = {
        getChatFlowById: jest.fn().
            mockResolvedValue({
                tryGetNextState: jest.fn().mockResolvedValue({
                    ...this.nextStateResultStub,
                    nextState: {
                        ...this.nextStateStub,
                        id: 'end',
                        proceedEvent: 'moveToState2'
                    }
                }),
                participatorFlows: [
                    {
                        participatorId: 1,
                        chatFlowId: 'flowId'
                    },
                    {
                        participatorId: 2,
                        chatFlowId: 'flowId'
                    }
                ]
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
        chatFlowGateway: this.chatFlowGatewayStub_OLD,
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

    async executeUsecaseWithSetupData(setupData = this.setupData) {
        const { usecase, requestModel } = this.generateUsecaseAndRequestModelBasedOnSetupDataForSingleRequestSingleParticipator(setupData);
        return await usecase.executeProceedInChat(requestModel);
    }

    setupData = {
        chatId: 'chatId',
        requestModelUserId: 'userId',
        content: 'dummyContent', 
        validatedEvent: 'dummyEvent',
        validateResultSuccess: true,
        validateResultError: '',
        chatGatewayResultSuccess: true,
        chatGatewayResultError: '',
        currentStateId: 'dummyStateId',
        nextStateResultSuccess: true,
        nextStateId: 'dummyStateId',
        nextStateResultError: '',
        proceedEvent: 'dummyEvent',
        isNextStateEndState: true,
        isCurrentStateEndState: true,
        responseOptions: { options: null } as any
    }

    generateUsecaseAndRequestModelBasedOnSetupDataForSingleRequestSingleParticipator(setup = this.setupData) {
        const { 
            requestModel, 
            validationGateway, 
            chatGateway, 
            chatFlowGateway
            } = this.arrangeMainExecutionFlowForSingleRequestAndSingleParticipant(setup);
        const usecase = ProceedInChatUseCase.fromJson({
            usecaseOutBoundary: this.usecaseOutBoundarySpy,
            chatGatewayToProceedInChat: chatGateway,
            chatFlowGateway: chatFlowGateway,
            validationGateway: validationGateway
        });

        return { usecase, requestModel };
    }

    arrangeMainExecutionFlowForSingleRequestAndSingleParticipant(setup = this.setupData) {
        const contentDummy = setup.content;
        const requestModel = {
            chatId: setup.chatId,
            userId: setup.requestModelUserId,
            stateInput: {
                stateId: 'stateId', // irrelevant atm
                response: {
                    responseMedia: 'text',
                    responseContent: contentDummy
                }
            }
        }

        const validationGateway = {
            ...this.validationGatewayStub,
            validateResponse: jest.fn().mockImplementation(() => {
                return {
                    ...this.eventValidationResultStub,
                    success: setup.validateResultSuccess,
                    error: setup.validateResultError,
                    event: setup.validatedEvent
                }
            })
        }

        const chatGateway = {
            ...this.chatGatewayStub,
            getChatById: jest.fn().mockResolvedValue({
                ...this.chatGatewayResultModelStub,
                success: setup.chatGatewayResultSuccess,
                error: setup.chatGatewayResultError,
                chat: {
                    ...this.chatStub,
                    currentState: {
                        ...this.currentStateStub,
                        id: setup.currentStateId,
                        isEndState: setup.isCurrentStateEndState
                    }
                }
            })
        }

        const chatFlowGateway = {
            ...this.chatFlowGatewayStub,
            getChatFlowById: jest.fn().mockResolvedValue({
                tryGetNextState: jest.fn().mockImplementation(() => {
                    return {
                        ...this.nextStateResultStub,
                        success: setup.nextStateResultSuccess,
                        error: setup.nextStateResultError,
                        nextState: {
                            ...this.nextStateStub,
                            id: setup.nextStateId,
                            proceedEvent: setup.proceedEvent,
                            participator1Options: setup.responseOptions,
                            participator2Options: setup.responseOptions,
                            isEndState: setup.isNextStateEndState
                        }
                    }
                })
            })
        }

        return { requestModel, validationGateway, chatGateway, chatFlowGateway };
    }
    
    generateUsecaseAndRequestModelBasedOnSetupDataForTwoRequests(setup = this.setupData) {
        const {
            requestModels,
            validationGateway,
            chatGateway,
            chatFlowGateway
        } = this.arrangeMainExecutionFlowForTwoRequests(setup);
        const usecase = ProceedInChatUseCase.fromJson({
            usecaseOutBoundary: this.usecaseOutBoundarySpy,
            chatGatewayToProceedInChat: chatGateway,
            chatFlowGateway: chatFlowGateway,
            validationGateway: validationGateway
        });
        return { usecase, requestModels };
    }

    arrangeMainExecutionFlowForTwoRequests(setup = this.setupData) {
        const contentDummy = setup.content;
        const requestModels = [
            {
                chatId: setup.chatId,
                userId: setup.requestModelUserId,
                stateInput: {
                    stateId: 'stateId', // irrelevant atm
                    response: {
                        responseMedia: 'text',
                        responseContent: contentDummy
                    }
                }
            },
            {
                chatId: setup.chatId,
                userId: setup.requestModelUserId,
                stateInput: {
                    stateId: 'stateId', // irrelevant atm
                    response: {
                        responseMedia: 'text',
                        responseContent: contentDummy
                    }
                }
            }
        ]

        const validationGateway = {
            ...this.validationGatewayStub,
            validateResponse: jest.fn().mockImplementation(() => {
                return {
                    ...this.eventValidationResultStub,
                    success: setup.validateResultSuccess,
                    error: setup.validateResultError,
                    event: setup.validatedEvent
                }
            })
        }

        const chatGateway = {
            ...this.chatGatewayStub,
            getChatById: jest.fn().mockResolvedValue({
                ...this.chatGatewayResultModelStub,
                success: setup.chatGatewayResultSuccess,
                error: setup.chatGatewayResultError,
                chat: {
                    ...this.chatStub,
                    currentState: {
                        ...this.currentStateStub,
                        id: setup.currentStateId
                    }
                }
            })
        }

        const chatFlowGateway = {
            ...this.chatFlowGatewayStub,
            getChatFlowById: jest.fn().mockResolvedValue({
                tryGetNextState: jest.fn().mockImplementation(() => {
                    return {
                        ...this.nextStateResultStub,
                        success: setup.nextStateResultSuccess,
                        error: setup.nextStateResultError,
                        nextState: {
                            ...this.nextStateStub,
                            id: setup.nextStateId,
                            proceedEvent: setup.proceedEvent,
                            participator1Options: setup.responseOptions,
                            participator2Options: setup.responseOptions,
                            isEndState: setup.isNextStateEndState
                        }
                    }
                })
            })
        }

        return { requestModels, validationGateway, chatGateway, chatFlowGateway };
    }

    setupSingleResultModel(errors: string[] = [], isEndState = true, chatNextStateId = '') {
        return {
            errors: errors,
            chatNextStateId: chatNextStateId,
            isEndState: isEndState
        }
    }
}

new ProceedInChatUseCaseTestBase().runTest();