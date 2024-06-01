import ProceedInChatRequestModel from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';

class ProceedInChatValidationUseCaseTest {
    runTests() {
        describe('Given a spy usecaseOutBoundary, a stub participant 1 User ID and a stub request model', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }

            const nextStateDummy = {
                id: 'nextStateId',
                participator1NextState: '',
                participator2NextState: '',
                proceedEvent: ''
            }

            const nextStateResultDummy = {
                success: true,
                error: '',
                nextState: nextStateDummy
            }

            const chatFlowGatewayDummy = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue(nextStateResultDummy)
                })
            }

            const stubParticipator1UserId = 'participator1UserId';
            const stubUserId = stubParticipator1UserId;
            const stubChatId = 'chatId';

            const eventValidationResultStub = {
                success: true,
                error: '',
                event: 'event'
            }

            const inputResponseStub = {
                responseMedia: 'text',
                responseContent: 'responseContent',
                eventValidationResult: eventValidationResultStub
            }

            const dummyStateInput = {
                response: inputResponseStub
            };

            const stubRequestModel = {
                userId: stubUserId,
                chatId: stubChatId,
                stateInput: dummyStateInput
            }

            const dummyChat = { 
                currentState: {
                    participator1State: '',
                    participator2State: '',
                    proceedEvent: ''
                },
                participator1UserId: '',
                participator2UserId: '',
                chatFlowId: ''
            }

            const dummyChatGatewayResult = {
                success: false,
                error: '',
                chat: dummyChat
            };

            const setupStateInputStubWithEvent = (event: string) => ({
                ...dummyStateInput,
                response: {
                    ...inputResponseStub,
                    eventValidationResult: {
                        ...eventValidationResultStub,
                        event: event
                    }
                }
            });
            
            describe('Given a stub chat gateway with an invalid chat', () => {
                const invalidchatIdError = 'Invalid chat id';
                const chatGatewayStubWithInvalidChatError = {
                    getChatById: jest.fn().mockResolvedValue({
                        ...dummyChatGatewayResult,
                        error: invalidchatIdError
                    })
                }
                describe('Given a stub request model with empty chat id', () => {
                    const stubEmptyChatId = '';
                    const stubRequestModelWithEmptyChatId = ProceedInChatRequestModel.fromJson({
                        ...stubRequestModel,
                        chatId: stubEmptyChatId
                    });
        
                    expectError(usecaseOutBoundarySpy, chatGatewayStubWithInvalidChatError, chatFlowGatewayDummy, 
                        stubRequestModelWithEmptyChatId, invalidchatIdError);
                });
            });
            
            describe('Given participator 2 ID, stub state input, stub chat entity and stub gateway result', () => {
                const stubParticipator2UserId = 'participator2UserId';
                
                const stubStateInputEvent = 'event';
            
                const stubStateInput = setupStateInputStubWithEvent(stubStateInputEvent);
                
                const chatGatewayStubP1State = 'state1'
                const chatGatewayStubP2State = 'state2'
                const chatGatewayStubEvent = 'event'
            
                const stubChatEntity = {
                    currentState: {
                        participator1State: chatGatewayStubP1State,
                        participator2State: chatGatewayStubP2State,
                        proceedEvent: chatGatewayStubEvent
                    },
                    participator1UserId: stubParticipator1UserId,
                    participator2UserId: stubParticipator2UserId,
                } 
            
                const stubChatGatewayResult = {
                    success: true,
                    chat: stubChatEntity
                }
            
                describe('Given a stub empty success gateway', () => {
                    const chatGatewayStub = {
                        getChatById: jest.fn().mockResolvedValue(stubChatGatewayResult)
                    }
                    describe('Given a stub request model with empty user id', () => {
                        const stubUserId = '';
                        const stubRequestModelWithOnlyEmptyUserId = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            userId: stubUserId
                        });
                        expectError(usecaseOutBoundarySpy, chatGatewayStub, chatFlowGatewayDummy,
                            stubRequestModelWithOnlyEmptyUserId, 'User is not a participator in this chat');
                    });
                });

                describe('Given a stub chat gateway with valid chat and user', () => {    
                    const chatGatewayStubWithOnlyStateInputValuesEmpty = {
                        getChatById: jest.fn().mockResolvedValue({
                            ...stubChatGatewayResult,
                            success: true,
                            chat: {
                                ...stubChatEntity,
                                stateInput: {
                                    stateParticipator1: '',
                                    stateParticipator2: '',
                                    event: ''
                                }
                            }
                        })
                    }
                    
                    describe('Given a stub request model with invalid event', () => {
                        const stubStateInputEventEmpty = ''
                        const stubStateInputWithOnlyEmptyEvent = {...stubStateInput,
                            proceedEvent: stubStateInputEventEmpty
                        }
                        const stubRequestModelWithOnlyInputEventEmpty = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            stateInput: stubStateInputWithOnlyEmptyEvent
                        });
            
                        expectError(usecaseOutBoundarySpy, chatGatewayStubWithOnlyStateInputValuesEmpty, 
                            chatFlowGatewayDummy, stubRequestModelWithOnlyInputEventEmpty, 'Invalid chat state event');
                    });
                });

                describe('Given a stub chat gateway with valid chat gateway result', () => {
                    const chatGatewayStubWithValidChatAndUser = {
                        getChatById: jest.fn().mockResolvedValue(stubChatGatewayResult)
                    }
                    describe('Given a stub chat flow gateway with a next state', () => {
                        const chatFlowGatewayStubWithNextState = chatFlowGatewayDummy;

                        

                        describe('When a request model with a different event is sent to the use case', () => {
                            const stubStateInput = setupStateInputStubWithEvent('differentEvent');
                            const stubRequestModelWithDifferentEvent = ProceedInChatRequestModel.fromJson({
                                ...stubRequestModel,
                                stubStateInput
                            });
                            expectError(usecaseOutBoundarySpy, chatGatewayStubWithValidChatAndUser, chatFlowGatewayStubWithNextState,
                                stubRequestModelWithDifferentEvent, 'Invalid chat state event');
                        });
                    });
                });
            
                describe('Given a stub chat gateway with a valid chat and a valid state', () => {
                    const chatGatewaySuccessStub = {
                        getChatById: jest.fn().mockResolvedValue(stubChatGatewayResult)
                    }
                    it('should return a success result', async () => {
                        const stubRequestModelWithAllValidData = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            stateInput: stubStateInput
                        });
                        await expectNoErrors(usecaseOutBoundarySpy, chatGatewaySuccessStub, 
                            chatFlowGatewayDummy, stubRequestModelWithAllValidData);
                    });
                });
            });
            
            async function expectNoErrors(
                usecaseOutBoundarySpy: { sendResultModel: any; }, 
                chatGatewayStub: { getChatById: any; }, 
                chatFlowGatewayStub: { getChatFlowById: any; },
                requestModel: ProceedInChatRequestModel
            ) {
                const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub, chatFlowGatewayStub);
                await dummyUseCase.executeProceedInChat(requestModel);
                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                    errors: []
                }));
            }
            
            function expectError(
                usecaseOutBoundarySpy: { sendResultModel: any; }, 
                chatGatewayStub: { getChatById: any; }, 
                chatFlowGatewayStub: { getChatFlowById: any; },
                requestModel: ProceedInChatRequestModel,
                expectedError: string
            ) {
                it(`should return an ${expectedError} result`, async () => {
                    const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub, chatFlowGatewayStub)
                    await dummyUseCase.executeProceedInChat(requestModel);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        errors: expect.arrayContaining([expectedError])
                    }));
                });
            }
        });
    }
}

const validationTest = new ProceedInChatValidationUseCaseTest();
validationTest.runTests();