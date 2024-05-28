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
                    const stubUserId = stubParticipator1UserId;
                    const stubEmptyChatId = '';
                    const dummyStateInput = {
                        stateParticipator1: '',
                        stateParticipator2: '',
                        event: ''
                    };
                    const stubRequestModel = new ProceedInChatRequestModel(
                        stubUserId,
                        stubEmptyChatId,
                        dummyStateInput
                    )
                    expectInvalidChatId(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModel);
                });
            });

            describe('Given a stub empty success gateway', () => {
                const chatGatewayStub = {
                    getChatById: jest.fn().mockResolvedValue({
                        success: true,
                        chat: {
                            currentState: {
                                participator1: 'state1',
                                participator2: 'state2',
                            },
                            participator1UserId: stubParticipator1UserId,
                            participator2UserId: stubParticipator2UserId
                        }
                    })
                }
                describe('Given a stub request model with empty user id', () => {
                    const stubUserId = '';
                    const stubChatId = 'chatId';
                    const stubStateInput = {
                        stateParticipator1: 'state1',
                        stateParticipator2: 'state2',
                        event: 'event'
                    };
                    const stubRequestModel = new ProceedInChatRequestModel(
                        stubUserId,
                        stubChatId,
                        stubStateInput
                    )
                    it('should return an error result', async () => {
                        const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
                        await dummyUseCase.executeProceedInChat(stubRequestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            errors: expect.arrayContaining(['User is not a participator in this chat'])
                        }));
                    });
                });
            });

            describe('Given a stub chat gateway with a valid chat and user but invalid states', () => {
                const stubUserId = 'userId';
                const stubChatId = 'chatId';

                const stubStateInputParticipator1 = 'state1';
                const stubStateInputParticipator2 = 'state2';
                const stubStateInputEvent = 'event';

                describe('Given only an invalid state for participator 1', () => {
                    const chatGatewayStub = {
                        getChatById: jest.fn().mockResolvedValue({
                            success: true,
                            chat: {
                                stateInput: {
                                    stateParticipator1: '',
                                    stateParticipator2: stubParticipator2UserId,
                                    event: stubStateInputEvent
                                },
                                currentState: {
                                    participator1: '',
                                    participator2: stubStateInputParticipator2
                                }
                            }
                        })
                    }
                    it('should return an error result', async () => {
                        const stubStateInput = {
                            stateParticipator1: stubStateInputParticipator1,
                            stateParticipator2: stubStateInputParticipator2,
                            event: stubStateInputEvent
                        }
                        const stubRequestModel = new ProceedInChatRequestModel(
                            stubUserId,
                            stubChatId,
                            stubStateInput
                        )
                        const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
                        await dummyUseCase.executeProceedInChat(stubRequestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            errors: expect.arrayContaining(['Invalid chat state for participator'])
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
                                participator1: stubStateInputParticipator1,
                                participator2: stubStateInputParticipator2
                            }
                        }
                    })
                }


                describe('Given a stub request model with invalid state for participator 1', () => {
                    const stubStateInputParticipator1Empty = ''
                    const stubStateInput = {
                        stateParticipator1: stubStateInputParticipator1Empty,
                        stateParticipator2: stubStateInputParticipator2,
                        event: stubStateInputEvent
                    }
                    const stubRequestModel = new ProceedInChatRequestModel(
                        stubUserId,
                        stubChatId,
                        stubStateInput
                    )

                    expectInvalidChatState(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModel);
                });

                describe('Given a stub request model with invalid state for participator 2', () => {
                    const stubStateInputParticipator2Empty = ''
                    const stubStateInput = {
                        stateParticipator1: stubStateInputParticipator1,
                        stateParticipator2: stubStateInputParticipator2Empty,
                        event: stubStateInputEvent
                    }
                    const stubRequestModel = new ProceedInChatRequestModel(
                        stubUserId,
                        stubChatId,
                        stubStateInput
                    )

                    expectInvalidChatState(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModel);
                });
                
                describe('Given a stub request model with invalid event', () => {
                    const stubStateInputEventEmpty = ''
                    const stubStateInput = {
                        stateParticipator1: stubStateInputParticipator1,
                        stateParticipator2: stubStateInputParticipator2,
                        event: stubStateInputEventEmpty
                    }
                    const stubRequestModel = new ProceedInChatRequestModel(
                        stubUserId,
                        stubChatId,
                        stubStateInput
                    )

                    expectInvalidChatState(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModel);
                });
            });
            describe('Given a stub chat gateway with a valid chat and a valid state', () => {
                const chatGatewayStub = {
                    getChatById: jest.fn().mockResolvedValue({
                        success: true,
                        chat: {
                            error: '',
                            currentState: 'valid',
                            participator1UserId: stubParticipator1UserId,
                            participator2UserId: stubParticipator2UserId
                        }
                    })
                }
                it('should return a success result', async () => {
                    const stubUserId = stubParticipator1UserId;
                    const stubChatId = 'chatId';
                    const stubStateInput = {
                        stateParticipator1: 'state1',
                        stateParticipator2: 'state2',
                        event: 'event'
                    
                    };
                    const stubRequestModel = new ProceedInChatRequestModel(
                        stubUserId,
                        stubChatId,
                        stubStateInput
                    )
                    await expectNoErrors(usecaseOutBoundarySpy, chatGatewayStub, stubRequestModel);
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

        function expectChatDoesNotExist(usecaseOutBoundarySpy: { sendResultModel: any; }, chatGatewayStub: { getChatById: any; }, dummyRequestModel: ProceedInChatRequestModel) {
            it('should return an error result', async () => {
                const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
                await dummyUseCase.executeProceedInChat(dummyRequestModel);
                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                    errors: expect.arrayContaining(['Chat does not exist'])
                }));
            });
        }

        function expectInvalidChatId(usecaseOutBoundarySpy: { sendResultModel: any; }, chatGatewayStub: { getChatById: any; }, stubRequestModel: ProceedInChatRequestModel) {
            it('should return an error result', async () => {
                const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
                await dummyUseCase.executeProceedInChat(stubRequestModel);
                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                    errors: expect.arrayContaining(['Invalid chat id'])
                }));
            });
        }

        function expectInvalidChatState(usecaseOutBoundarySpy: { sendResultModel: any; }, chatGatewayStub: { getChatById: any; }, stubRequestModel: ProceedInChatRequestModel) {
            it('should return an error result', async () => {
                const dummyUseCase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub);
                await dummyUseCase.executeProceedInChat(stubRequestModel);
                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                    errors: expect.arrayContaining(['Invalid chat current state object'])
                }));
            });
        }
    }
}

const proceedInChatUseCaseTest = new ProceedInChatUseCaseTest();
proceedInChatUseCaseTest.runTests();