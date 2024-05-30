import { error } from 'console';
import ProceedInChatRequestModel from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';

class ProceedInChatValidationUseCaseTest {
    runTests() {
        describe('Given a spy usecaseOutBoundary, a stub participant 1 User ID and a stub request model', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }

            const chatFlowGatewayDummy = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    getNextStateId: jest.fn().mockResolvedValue('')
                })
            }

            const stubParticipator1UserId = 'participator1UserId';
            const stubUserId = stubParticipator1UserId;
            const stubChatId = 'chatId';

            const dummyStateInput = {
                participator1State: '',
                participator2State: '',
                proceedEvent: ''
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
                
                const stubStateInputParticipator1 = 'state1';
                const stubStateInputParticipator2 = 'state2';
                const stubStateInputEvent = 'event';
            
                const stubStateInput = {...dummyStateInput,
                    participator1State: stubStateInputParticipator1,
                    participator2State: stubStateInputParticipator2,
                    proceedEvent: stubStateInputEvent
                };
                
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
            
                describe('Given only an invalid state for participator 1', () => {
                    const chatGatewayStub = {
                        getChatById: jest.fn().mockResolvedValue(stubChatGatewayResult)
                    }
                    const stubStateInputWithOnlyInvalidP1State = {...stubStateInput,
                        participator1State: '',
                    }
                    const stubRequestModelWithOnlyEmptyP1State = ProceedInChatRequestModel.fromJson({
                        ...stubRequestModel,
                        stateInput: stubStateInputWithOnlyInvalidP1State
                    })
                    
                    expectError(usecaseOutBoundarySpy, chatGatewayStub, chatFlowGatewayDummy,
                        stubRequestModelWithOnlyEmptyP1State, 'Invalid chat state for participator 1');
                });

                describe('Given a stub chat gateway with valid chat and user but invalid states', () => {    
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
            
                    describe('Given a request with only invalid state for participator 1', () => {
                        const stubStateInputParticipator1Empty = ''
                        const stubStateInputWithOnlyP1StateEmpty = {...stubStateInput,
                            participator1State: stubStateInputParticipator1Empty,
                        }
                        const stubRequestModelWithOnlyP1StateEmpty = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            stateInput: stubStateInputWithOnlyP1StateEmpty
                        })
            
                        expectError(usecaseOutBoundarySpy, chatGatewayStubWithOnlyStateInputValuesEmpty, 
                            chatFlowGatewayDummy, stubRequestModelWithOnlyP1StateEmpty, 'Invalid chat state for participator 1');
                    });
            
                    describe('Given a stub request model with invalid state for participator 2', () => {
                        const stubStateInputParticipator2Empty = ''
                        const stubStateInputWithOnlyP2StateEmpty = {...stubStateInput,
                            participator2State: stubStateInputParticipator2Empty,
                        }
                        const stubRequestModelWithOnlyP2StateEmpty = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            stateInput: stubStateInputWithOnlyP2StateEmpty
                        })
            
                        expectError(usecaseOutBoundarySpy, chatGatewayStubWithOnlyStateInputValuesEmpty, 
                            chatFlowGatewayDummy, stubRequestModelWithOnlyP2StateEmpty, 'Invalid chat state for participator 2');
                    });
                    
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
            
                describe('Given a stub chat gateway with a valid chat and a valid state', () => {
                    const chatGatewaySuccessStub = {
                        getChatById: jest.fn().mockResolvedValue(stubChatGatewayResult)
                    }
                    it('should return a success result', async () => {
                        const stubStateInputWithAllValidData = {...stubStateInput,
                            participator1State: 'state1',
                            participator2State: 'state2',
                            proceedEvent: 'event'
                        };
                        const stubRequestModelWithAllValidData = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            stateInput: stubStateInputWithAllValidData
                        });
                        await expectNoErrors(usecaseOutBoundarySpy, chatGatewaySuccessStub, chatFlowGatewayDummy, stubRequestModelWithAllValidData);
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