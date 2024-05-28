import ProceedInChatRequestModel from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';

class ProceedInChatUseCaseTest {
    runTests() {
        describe('Given a spy usecaseOutBoundary', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }
            const stubParticipator1UserId = 'participator1UserId';
            const stubParticipator2UserId = 'participator2UserId';
            
            const dummyStateInput = {
                participator1State: '',
                participator2State: '',
                proceedEvent: ''
            };
            
            const stubStateInputParticipator1 = 'state1';
            const stubStateInputParticipator2 = 'state2';
            const stubStateInputEvent = 'event';

            const stubStateInput = {...dummyStateInput,
                participator1State: stubStateInputParticipator1,
                participator2State: stubStateInputParticipator2,
                proceedEvent: stubStateInputEvent
            };
            
            const stubUserId = stubParticipator1UserId;
            const stubChatId = 'chatId';

            const stubRequestModel = {
                userId: stubUserId,
                chatId: stubChatId,
                stateInput: dummyStateInput
            }

            describe('Given a stub chat gateway with an invalid chat', () => {
                const invalidchatIdError = 'Invalid chat id';
                const chatGatewayStub = {
                    getChatById: jest.fn().mockResolvedValue({
                        success: false,
                        error: invalidchatIdError,
                        chat: null
                    })
                }
                describe('Given a stub request model with empty chat id', () => {
                    const stubEmptyChatId = '';
                    const stubRequestModelWithEmptyChatId = ProceedInChatRequestModel.fromJson({
                        ...stubRequestModel,
                        chatId: stubEmptyChatId
                    });

                    expectError(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModelWithEmptyChatId, invalidchatIdError);
                });
            });

            describe('Given a stub empty success gateway', () => {
                const chatGatewayStub = {
                    getChatById: jest.fn().mockResolvedValue({
                        success: true,
                        chat: {
                            currentState: {
                                participator1State: 'state1',
                                participator2State: 'state2',
                            },
                            participator1UserId: stubParticipator1UserId,
                            participator2UserId: stubParticipator2UserId
                        }
                    })
                }
                describe('Given a stub request model with empty user id', () => {
                    const stubUserId = '';
                    const stubChatId = 'chatId';
                    const stubRequestModelWithOnlyEmptyUserId = ProceedInChatRequestModel.fromJson({
                        ...stubRequestModel,
                        userId: stubUserId
                    });
                    it('should return an error result', async () => {
                        const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
                        await dummyUseCase.executeProceedInChat(stubRequestModelWithOnlyEmptyUserId);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            errors: expect.arrayContaining(['User is not a participator in this chat'])
                        }));
                    });
                });
            });

            describe('Given a stub chat gateway with valid chat and user but invalid states', () => {
                const stubChatId = 'chatId';

                describe('Given only an invalid state for participator 1', () => {
                    const chatGatewayStub = {
                        getChatById: jest.fn().mockResolvedValue({
                            success: true,
                            chat: {
                                currentState: {
                                    participator1: stubStateInputParticipator1,
                                    participator2: stubStateInputParticipator2,
                                    proceedEvent: stubStateInputEvent
                                }
                            }
                        })
                    }
                    it('should return an error result', async () => {
                        const stubStateInputWithOnlyInvalidP1State = {...stubStateInput,
                            participator1State: '',
                        }
                        const stubRequestModelWithOnlyEmptyP1State = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            stateInput: stubStateInputWithOnlyInvalidP1State
                    })
                        const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
                        await dummyUseCase.executeProceedInChat(stubRequestModelWithOnlyEmptyP1State);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            errors: expect.arrayContaining(['Invalid chat state for participator 1'])
                        }));
                    });
                });
                
                const chatGatewayStub = {
                    getChatById: jest.fn().mockResolvedValue({
                        success: true,
                        chat: {
                            stateInput: {
                                stateParticipator1: '',
                                stateParticipator2: '',
                                event: ''
                            },
                            currentState: {
                                participator1State: stubStateInputParticipator1,
                                participator2State: stubStateInputParticipator2,
                                proceedEvent: stubStateInputEvent
                            },
                            participator1UserId: stubParticipator1UserId,
                            participator2UserId: stubParticipator2UserId
                        }
                    })
                }


                describe('Given request(V,V,V) with invalid state for participator 1', () => {
                    const stubStateInputParticipator1Empty = ''
                    const stubStateInputWithOnlyP1StateEmpty = {...stubStateInput,
                        participator1State: stubStateInputParticipator1Empty,
                    }
                    const stubRequestModelWithOnlyP1StateEmpty = ProceedInChatRequestModel.fromJson({
                        ...stubRequestModel,
                        stateInput: stubStateInputWithOnlyP1StateEmpty
                    })

                    expectError(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModelWithOnlyP1StateEmpty, 'Invalid chat state for participator 1');
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

                    expectError(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModelWithOnlyP2StateEmpty, 'Invalid chat state for participator 2');
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

                    expectError(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModelWithOnlyInputEventEmpty, 'Invalid chat state event');
                });
            });

            describe('Given a stub chat gateway with a valid chat and a valid state', () => {
                const chatGatewaySuccessStub = {
                    getChatById: jest.fn().mockResolvedValue({
                        success: true,
                        chat: {
                            error: '',
                            currentState: {
                                participator1State: 'state1',
                                participator2State: 'state2',
                                proceedEvent: 'event'
                            },
                            participator1UserId: stubParticipator1UserId,
                            participator2UserId: stubParticipator2UserId
                        }
                    })
                }
                it('should return a success result', async () => {
                    const stubChatId = 'chatId';
                    const stubStateInputWithAllValidData = {...stubStateInput,
                        participator1State: 'state1',
                        participator2State: 'state2',
                        proceedEvent: 'event'
                    };
                    const stubRequestModel = new ProceedInChatRequestModel(
                        stubUserId,
                        stubChatId,
                        stubStateInputWithAllValidData
                    )
                    await expectNoErrors(usecaseOutBoundarySpy, chatGatewaySuccessStub, stubRequestModel);
                });
            });
        });

        async function expectNoErrors(usecaseOutBoundarySpy: { sendResultModel: any; }, chatGatewayStub: { getChatById: any; }, stubRequestModel: ProceedInChatRequestModel) {
            const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
            await dummyUseCase.executeProceedInChat(stubRequestModel);
            expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith({
                errors: []
            });
        }

        function expectError(usecaseOutBoundarySpy: { sendResultModel: any; }, chatGatewayStub: { getChatById: any; }, stubRequestModel: ProceedInChatRequestModel,
            expectedError: string
        ) {
            it('should return an error result', async () => {
                const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
                await dummyUseCase.executeProceedInChat(stubRequestModel);
                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                    errors: expect.arrayContaining([expectedError])
                }));
            });
        }
    }
}

const proceedInChatUseCaseTest = new ProceedInChatUseCaseTest();
proceedInChatUseCaseTest.runTests();