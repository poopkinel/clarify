import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';
import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';

class ProceedInChatUseCaseIntegrationTest extends ProceedInChatUseCaseBaseTest{
    runTests() {
        const requestModelStub = {
            chatId: 'chatId',
            userId: this.userIdStub,
            stateInput: {
                proceedEvent: 'event',
                response: {
                    responseMedia: 'text',
                    responseContent: '',
                }
            }
        }

        const emptyResponseOptionStub = {
            options: null
        }

        const responseOptionsStub = {
            responseOptionsParticipant1: emptyResponseOptionStub,
            responseOptionsParticipant2: emptyResponseOptionStub
        }

        describe.skip('Given a request model stub and empty response options stub', () => {

            const chatFlowGatewayStub = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            responseOptions: responseOptionsStub
                        }
                    })
                })
            }

            describe('When usecase is called with request model', () => {
                
                it('usecaseOutBoundary should be called with a result model with next state and response options', async () => {
                    const usecase = ProceedInChatUseCase.fromJson({
                        ...this.usecaseStub,
                        chatFlowGateway: chatFlowGatewayStub
                    });
                    const requestModel = requestModelStub;
                    await usecase.executeProceedInChat(requestModel);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatNextStateId: 'nextState',
                        responseOptions: {
                            responseOptionsParticipant1: {
                                options: null
                            },
                            responseOptionsParticipant2: {
                                options: null
                            }
                        }
                    }));
                });
            });
        });

        describe.skip('Given a request model stub and non-empty response options stub', () => {
            const responseOptionsP1OnlyStub = {
                ...responseOptionsStub,
                responseOptionsParticipant1: {
                    options: [{
                        responseMedia: 'text',
                        responseRestrictions: {
                            validatorId: 'CantBeQuestionValidatorId',
                        }
                    }]
                }
            }

            const chatFlowGatewayStub = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            responseOptions: responseOptionsP1OnlyStub
                        }
                    })
                })
            }

            describe('When usecase is called with request model', () => {
                
                it('usecaseOutBoundary should be called with a result model with next state and response options', async () => {
                    const usecase = ProceedInChatUseCase.fromJson({
                        ...this.usecaseStub,
                        chatFlowGateway: chatFlowGatewayStub
                    });
                    const requestModel = requestModelStub;
                    await usecase.executeProceedInChat(requestModel);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatNextStateId: 'nextState',
                        responseOptions: responseOptionsP1OnlyStub
                    }));
                });
            });
        });

        describe.skip('Given a mock chatFlowGateway with stub request models and response options', () => {
            var chatCounter = 0;
            const chatFlowGateway = {
                getChatFlowById: jest.fn().mockImplementation(async () => {
                    var nextState: any;
                    var responseOptions: any;
                    if (chatCounter === 0) {
                        responseOptions = {
                            responseOptionsParticipant1: {
                                options: [{
                                    responseMedia: 'text',
                                    responseRestrictions: {
                                        validatorId: 'CantBeQuestionValidatorId',
                                    }
                                }]
                            },
                            responseOptionsParticipant2: emptyResponseOptionStub
                        }
                        nextState = {
                            ...this.nextStateStub,
                            id: 'state0',
                            responseOptions: responseOptions
                        }

                    } else if (chatCounter === 1) {
                        responseOptions = {
                            responseOptionsParticipant1: {
                                options: null
                            },
                            responseOptionsParticipant2: {
                                options: [{
                                    responseMedia: 'muiltipleChoice',
                                    responseRestrictions: {
                                        validatorId: 'yesOrNoValidatorId',
                                    }
                                }]
                            }
                        }
                        nextState = {
                            ...this.nextStateStub,
                            id: 'state1',
                            responseOptions: responseOptions
                        }
                    } else if (chatCounter === 2) {
                        responseOptions = {
                            responseOptionsParticipant1: {
                                options: null
                            },
                            responseOptionsParticipant2: {
                                options: [{
                                    responseMedia: 'text',
                                    responseRestrictions: {
                                        validatorId: 'MustBeParaphraseValidatorId',
                                    }
                                }]
                            }
                        }
                        nextState = {
                            ...this.nextStateStub,
                            id: 'state2',
                            responseOptions: responseOptions
                        }
                    }
                    
                    return {
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...this.nextStateResultStub,
                            nextState: nextState
                        })
                    }
                })
            }
            describe('Given an expected result model', () => {
                const resultModel = {
                    errors: [],
                    chatNextStateId: 'state0',
                    responseOptions: {
                        responseOptionsParticipant1: {
                            options: [{
                                responseMedia: 'text',
                                responseRestrictions: {
                                    validatorId: 'CantBeQuestionValidatorId',
                                }
                            }]
                        },
                        responseOptionsParticipant2: emptyResponseOptionStub
                    }
                }
                describe('When usecase is called with request model', () => {
                    const requestModel = requestModelStub;

                    it('usecaseOutBoundary should be called with a result model with next state and response options according to sequence', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...this.usecaseStub,
                            chatFlowGateway: chatFlowGateway
                        });
                        await usecase.executeProceedInChat(requestModel);
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            chatNextStateId: 'state0',
                            responseOptions: responseOptionsStub
                        }));

                        chatCounter++;

                        await usecase.executeProceedInChat(requestModel);
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            chatNextStateId: 'state1',
                            responseOptions: responseOptionsStub
                        }));

                        chatCounter++;

                        await usecase.executeProceedInChat(requestModel);
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            chatNextStateId: 'state2',
                            responseOptions: responseOptionsStub
                        }));
                    });
                });
            });
        });
    }
}

const proceedInChatUseCaseIntegrationTest = new ProceedInChatUseCaseIntegrationTest();
proceedInChatUseCaseIntegrationTest.runTests();