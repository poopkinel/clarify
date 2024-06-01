import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase"
import ChatReponseOptions from "../../../src/entities/responseOption/chatResponseOptions"

class ProceedInChatUseCaseGetChatReponseOptionsTest {
    runTests() {
        describe('Given a usecaseOutBoundarySpy, chatGateway stub, chatFlowGateway stub, usecase stub and request model stub', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }

            const userIdStub = 'userId';

            const chatGatewayStub = {
                getChatById: jest.fn().mockResolvedValue({
                    success: true,
                    chat: {
                        currentState: {
                            participator1State: 'state',
                            participator2State: 'state',
                            proceedEvent: 'event'
                        },
                        participator1UserId: userIdStub,
                        participator2UserId: 'userId2',
                    }
                })
            }

            
            const responseOptionsStub = {
                responseOptionsParticipant1: [],
                responseOptionsParticipant2: []
            }

            const nextStateStub = {
                id: 'nextState',
                participator1State: 'state',
                participator2State: 'state',
                proceedEvent: 'event',
                responseOptions: responseOptionsStub
            }

            const nextStateResultStub = {
                success: true,
                nextState: nextStateStub
            }

            const chatFlowGatewayStub = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue(nextStateResultStub)
                })
            }

            const usecaseStubJson = {
                usecaseOutBoundary: usecaseOutBoundarySpy,
                chatGatewayToProceedInChat: chatGatewayStub,
                chatFlowGateway: chatFlowGatewayStub
            };

            const usecaseStub = ProceedInChatUseCase.fromJson(usecaseStubJson);

            const stateInputStub = {
                proceedEvent: 'event',
            }

            const requestModelStub = {
                chatId: 'chatId',
                userId: userIdStub,
                stateInput: stateInputStub
            }

            describe('Given a chatFlowGateway returning a dummy chat state with empty options', () => {
                describe('When a request model for chat options is sent', () => {
                    it('usecase should be called with a result containing an empty list', async () => {
                        const usecase = usecaseStub;
                        await usecase.executeProceedInChat(requestModelStub);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            responseOptions: {
                                responseOptionsParticipant1: [],
                                responseOptionsParticipant2: []
                            }
                        }));
                    })
                })
            })

            const setupChatFlowGatewayStub = (
                responseOptionsP1: ChatReponseOptions, responseOptionsP2: ChatReponseOptions
            ) => {
                return {
                    ...chatFlowGatewayStub,
                    getChatFlowById: jest.fn().mockResolvedValue({
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...nextStateResultStub,
                            nextState: {
                                ...nextStateStub,
                                responseOptions: {
                                    ...responseOptionsStub,
                                    responseOptionsParticipant1: responseOptionsP1,
                                    responseOptionsParticipant2: responseOptionsP2
                                }
                            }
                        })
                    })
                }
            }

            const responseOptionsP1Stub = {
                options: [{
                        responseMedia: {
                        media: 'text'
                    },
                    responseRestrictions: {
                        validatorId: 'CantBeQuestionValidatorId'
                    }
                }]
            }

            const responseOptionsP2Stub = {
                options: null
            }

            const responseOptionsP1ResultStub = {
                options: [{
                        responseMedia: {
                        media: 'text'
                    },
                    responseRestrictions: {
                        validatorId: 'CantBeQuestionValidatorId'
                    }
                }]
            }

            const responseOptionsP2ResultStub = {
                options: null
            }
            
            describe('Given a chatFlowGateway returning a dummy chat state with 1 option per participant', () => {
                const chatFlowGatewayOneOptionStub = setupChatFlowGatewayStub(
                    responseOptionsP1Stub,
                    responseOptionsP2Stub
                );

                describe('When a request model for chat options is sent', () => {
                    const requestModel = requestModelStub;

                    it('usecase should be called with a result containing a list with 1 option', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...usecaseStubJson,
                            chatFlowGateway: chatFlowGatewayOneOptionStub
                        });
                        await usecase.executeProceedInChat(requestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            responseOptions: {
                                responseOptionsParticipant1: responseOptionsP1ResultStub,
                                responseOptionsParticipant2: responseOptionsP2ResultStub
                            }
                        }));
                    });
                });
            });

            describe('Given a chatFlowGateway returning a stub chat state with 2 options', () => {
                const chatFlowGatewayTwoOptionStub = setupChatFlowGatewayStub(
                    {
                        options: null
                    }
                    ,{
                        options: [{
                            responseMedia: {
                                media: 'text'
                            },
                            responseRestrictions: {
                                validatorId: 'CantBeQuestionValidatorId'
                            }
                        }, {
                            responseMedia: {
                                media: 'image'
                            },
                            responseRestrictions: {
                                validatorId: 'CantBeQuestionValidatorId'
                            }
                        
                        }]
                    }
                );

                describe('When a request model for chat options is sent', () => {
                    const requestModel = {
                        ...requestModelStub,
                        chatId: 'chat2OptionsId',
                        stateInput: stateInputStub
                    }
                    it('usecase should be called with a result containing a list with 2 options', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...usecaseStubJson,
                            chatFlowGateway: chatFlowGatewayTwoOptionStub
                        })
                        await usecase.executeProceedInChat(requestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            responseOptions: {
                                responseOptionsParticipant1: {
                                    options: null
                                },
                                responseOptionsParticipant2: {
                                    options: [{
                                        responseMedia: {
                                            media: 'text'
                                        },
                                        responseRestrictions: {
                                            validatorId: 'CantBeQuestionValidatorId'
                                        }
                                    }, {
                                        responseMedia: {
                                            media: 'image'
                                        },
                                        responseRestrictions: {
                                            validatorId: 'CantBeQuestionValidatorId'
                                        }
                                    
                                    }]
                                }
                            }
                        }));
                    });
                });
            });

            // It should return the response options for each participant in the chat
        })
    }
}

const proceedInChatUseCaseGetChatResponseOptionsTest = new ProceedInChatUseCaseGetChatReponseOptionsTest();
proceedInChatUseCaseGetChatResponseOptionsTest.runTests();