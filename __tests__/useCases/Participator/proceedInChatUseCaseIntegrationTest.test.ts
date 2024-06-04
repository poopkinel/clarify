import UsecaseOutBoundary from '../../../src/boundaries/useCaseBoundaries/usecaseOutBoundary';
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

        const responseOptionEmptyStub = {
            options: null
        }

        const responseOptionEmptyInResultModel = {
            options: []
        }

        describe('Given a request model stub and empty response options stub', () => {

            const chatFlowGatewayEmptyOptionsStub = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            participator1Options: responseOptionEmptyStub,
                            participator2Options: responseOptionEmptyStub
                        }
                    })
                })
            }

            describe('When usecase is called with request model', () => {
                
                it('usecaseOutBoundary should be called with a result model with next state and response options', async () => {
                    const usecase = ProceedInChatUseCase.fromJson({
                        ...this.usecaseStub,
                        chatFlowGateway: chatFlowGatewayEmptyOptionsStub
                    });
                    await usecase.executeProceedInChat(requestModelStub);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatNextStateId: 'nextState',
                        responseOptionsForParticipant: {
                            options: []
                        }
                    }));
                });
            });
        });

        describe('Given a request model stub and non-empty response options stub', () => {
            const responseOptionsP1OnlyStub = {
                ...responseOptionEmptyStub,
                options: [{
                    responseMedia: {
                        media: 'text'
                    },
                    responseRestrictions: {
                        validatorId: 'CantBeQuestionValidatorId',
                    }
                }]
            }

            const chatFlowGatewayStub = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            participator1Options: responseOptionsP1OnlyStub,
                            participator2Options: responseOptionEmptyStub
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
                        responseOptionsForParticipant: {
                            options: [{
                                responseMedia: 'text',
                                responseRestrictions: 'CantBeQuestionValidatorId'
                            }]
                        }
                    }));
                });
            });
        });

        
        describe('Given a mock chatFlowGateway with stub request models and response options', () => {
            var chatCounter: number;
            const chatFlowGatewayMock = {
                getChatFlowById: jest.fn().mockImplementation(async () => {
                    const participator1OptionsFull = {
                        options: [{
                            responseMedia: {
                                media: 'text'
                            },
                            responseRestrictions: {
                                validatorId: 'CantBeQuestionValidatorId',
                            }
                        }]
                    };
    
                    const participator1OptionsEmpty = {
                        options: null
                    };
    
                    const paricipator1OptionsForEachState = [
                        participator1OptionsFull,
                        participator1OptionsEmpty,
                        participator1OptionsEmpty
                    ];
    
                    const nextState = {
                        ...this.nextStateStub,
                        id: `state${chatCounter}`,
                        participator1Options: paricipator1OptionsForEachState[chatCounter],
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
                describe('When usecase is called with request model', () => {
                    const requestModel = requestModelStub;
                    const expectedResponseOptionsFull = {
                        options: [{
                            responseMedia: 'text',
                            responseRestrictions: 'CantBeQuestionValidatorId'
                        }]
                    }

                    it('usecaseOutBoundary should be called with a result model with next state and response options according to sequence', async () => {
                        const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...this.usecaseStub,
                            chatFlowGateway: chatFlowGatewayMock,
                            usecaseOutBoundary: usecaseOutBoundarySpy
                        });

                        const expectedResponseOptionsForEachState = [
                            expectedResponseOptionsFull,
                            responseOptionEmptyInResultModel,
                            responseOptionEmptyInResultModel
                        ]

                        chatCounter = 0;
                        for (let i = 0; i < expectedResponseOptionsForEachState.length; i++) {
                            await usecase.executeProceedInChat(requestModel);
                            chatCounter++;
                            this.expectOptionsForState(`state${i}`, expectedResponseOptionsForEachState[i], usecaseOutBoundarySpy);
                        }
                    });
                });
            });
        });
        describe('Given a mock chatFlowGateway for both participators with stub request containing content', () => {
            var chatCounter: number;
            const chatFlowGatewayMock = {
                getChatFlowById: jest.fn().mockImplementation(async () => {
                    const participatorOptionsFull = {
                        options: [{
                            responseMedia: {
                                media: 'text'
                            },
                            responseRestrictions: {
                                validatorId: 'ValidatorId',
                            }
                        }]
                    };
    
                    const participatorOptionsEmpty = {
                        options: null
                    };
    
                    const paricipator1OptionsForEachState = [
                        participatorOptionsFull,
                        participatorOptionsEmpty,
                        participatorOptionsEmpty
                    ];

                    const paricipator2OptionsForEachState = [
                        participatorOptionsEmpty,
                        participatorOptionsFull,
                        participatorOptionsFull
                    ];
    
                    const nextState = {
                        ...this.nextStateStub,
                        id: `state${chatCounter}`,
                        participator1Options: paricipator1OptionsForEachState[chatCounter],
                        participator2Options: paricipator2OptionsForEachState[chatCounter]
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
                describe('When usecase is called with the correct request model for the chat, and for each participator', () => {
                    const participator1UserId = this.userIdStub;
                    const participator2UserId = this.stubParticipator2UserId;

                    const requestModelWithFullResponseOptionsStub = (userId: string, content: string) => {
                        return {
                            chatId: this.chatIdStub,
                            userId: userId,
                            stateInput: {
                                proceedEvent: 'event',
                                response: {
                                    responseMedia: 'text',
                                    responseContent: content
                                }
                            }
                        }
                    }
                    const requestModelsP1WithContentStubs = [
                        requestModelWithFullResponseOptionsStub(participator1UserId, 'content0'),
                        requestModelWithFullResponseOptionsStub(participator1UserId, 'content1'),
                        requestModelWithFullResponseOptionsStub(participator1UserId, 'content2')
                    ]

                    const requestModelsP2WithContentStubs = [
                        requestModelWithFullResponseOptionsStub(participator2UserId, 'content0'),
                        requestModelWithFullResponseOptionsStub(participator2UserId, 'content1'),
                        requestModelWithFullResponseOptionsStub(participator2UserId, 'content2')
                    ]

                    it('usecaseOutBoundary should be called with a result model with next state and response options according to sequence', async () => {
                        const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...this.usecaseStub,
                            chatFlowGateway: chatFlowGatewayMock,
                            usecaseOutBoundary: usecaseOutBoundarySpy
                        });

                        const responseOptionsFullInResultModel = {
                            options: [{
                                responseMedia: 'text',
                                responseRestrictions: 'ValidatorId'
                            }]
                        }

                        const expectedP1ResponseOptionsForEachState = [
                            responseOptionsFullInResultModel,
                            responseOptionEmptyInResultModel,
                            responseOptionEmptyInResultModel
                        ]

                        const expectedP2ResponseOptionsForEachState = [
                            responseOptionEmptyInResultModel,
                            responseOptionsFullInResultModel,
                            responseOptionsFullInResultModel,
                        ]

                        for (chatCounter = 0; chatCounter < expectedP1ResponseOptionsForEachState.length; chatCounter++) {
                            await usecase.executeProceedInChat(requestModelsP1WithContentStubs[chatCounter]);
                            this.expectOptionsForState(`state${chatCounter}`, expectedP1ResponseOptionsForEachState[chatCounter], usecaseOutBoundarySpy);

                            await usecase.executeProceedInChat(requestModelsP2WithContentStubs[chatCounter]);
                            this.expectOptionsForState(`state${chatCounter}`, expectedP2ResponseOptionsForEachState[chatCounter], usecaseOutBoundarySpy);
                        }
                    });
                });
            });
        });
    }

    private expectOptionsForState(
        chatNextStateId: string, 
        expectedResponseOptions1: { options: { responseMedia: string; responseRestrictions: string; }[]; },
        usecaseOutBoundary: any
    ) {
        expect(usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
            chatNextStateId: chatNextStateId,
            responseOptionsForParticipant: expectedResponseOptions1
        }));
    }
}

const proceedInChatUseCaseIntegrationTest = new ProceedInChatUseCaseIntegrationTest();
proceedInChatUseCaseIntegrationTest.runTests();