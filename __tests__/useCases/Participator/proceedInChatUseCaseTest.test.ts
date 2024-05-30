import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";

class ProceedInChatUseCaseTest {
    runTests() {
        const usecaseOutBoundarySpy = {
            sendResultModel: jest.fn()
        }
        
        const stateInputStub = {
            participator1State: 'state',
            participator2State: 'state',
            proceedEvent: 'event'
        }
        
        const requestModelStub = {
            chatId: 'chatId', 
            userId: 'userId1', 
            stateInput: stateInputStub
        }
        
        const chatFlowGatewayStub = {
            getChatFlowById: jest.fn().mockResolvedValue({
                getNextStateId: jest.fn().mockResolvedValue('state2Id')
            })
        }
        
        const chatCurrentStateStub = {
            participator1State: 'state',
            participator2State: 'state',
            proceedEvent: 'event'
        }

        const chatStub = {
            currentState: chatCurrentStateStub,
            participator1UserId: 'userId1',
            participator2UserId: 'userId2',
        }

        const chatGatewayResultModelStub = {
            success: true,
            chat: chatStub
        }

        const chatGatewayStub = {
            getChatById: jest.fn().mockResolvedValue(chatGatewayResultModelStub)
        }

        const expectedInResultModel = {
            errors: [],
            chatEndStateId: 'nextState'
        };

        describe('Given an empty chat flow gateway stub', () => {
            const chatFlowGatewayOneStateStub = {
                ...chatFlowGatewayStub,
                getChatFlowById: jest.fn().mockResolvedValue({
                    getNextStateId: jest.fn().mockResolvedValue('start-finish')
                })
            };

            describe('When a valid request model is sent to the use case', () => {
                it('should send a chat finished result model with the same state', async () => {
                    const usecase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub, chatFlowGatewayOneStateStub);
                    await usecase.executeProceedInChat(requestModelStub);
                    
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        ...expectedInResultModel,
                        chatEndStateId: 'start-finish',
                    }));
                });
            });
        });

        describe('Given a valid request model and a chat with 2 states', () => {
            const requestModelTwoStatesChatFlow = {
                ...requestModelStub,
                chatId: "chatIdTwoStates",
                stateInput: {
                    ...stateInputStub,
                    proceedEvent: 'moveToState2'
                }
            }

            const gatewayStubWithEventMoveToState2 = {
                getChatById: jest.fn().mockResolvedValue({
                    ...chatGatewayResultModelStub,
                    chat: {
                        ...chatStub,
                        currentState: {
                            ...chatCurrentStateStub,
                            proceedEvent: 'moveToState2'
                        }
                    }
                })
            }
            describe('When the request model is sent to the use case', () => {
                it('should send a result model with the transitioned new state', async () => {

                    const chatFlowGatewayStub = {
                        getChatFlowById: jest.fn().mockResolvedValue({
                            getNextStateId: jest.fn().mockResolvedValue('state2Id')
                        })
                    }

                    const usecase = new ProceedInChatUseCase(usecaseOutBoundarySpy, gatewayStubWithEventMoveToState2, chatFlowGatewayStub);
                    await usecase.executeProceedInChat(requestModelTwoStatesChatFlow);
                    
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        ...expectedInResultModel,
                        chatEndStateId: 'state2Id',
                    }));
                });
            });

            describe('Given a chat flow with 3 states and 2 valid request models', () => {
                var requestsCounter = 0;

                const chatGatewayFlowWith3StatesMock = {
                    getChatById: jest.fn().mockImplementation(() => {
                        if (requestsCounter == 0) {
                            return {
                                ...chatGatewayResultModelStub,
                                chat: {
                                    ...chatStub,
                                    currentState: {
                                        ...chatCurrentStateStub,
                                        proceedEvent: 'moveToState2'
                                    }
                                }
                            }
                        } else {
                            return {
                                ...chatGatewayResultModelStub,
                                chat: {
                                    ...chatStub,
                                    currentState: {
                                        ...chatCurrentStateStub,
                                        proceedEvent: 'moveToState3'
                                    }
                                }
                            }
                        }
                    })
                }

                const chatFlowGatewayWith3StatesMock = {
                    getChatFlowById: jest.fn().mockResolvedValue({
                        getNextStateId: jest.fn().mockImplementation(() => {
                            if (requestsCounter == 0) {
                                requestsCounter++;
                                return 'state2Id';
                            } else {
                                return 'state3Id';
                            }
                        })
                    })
                }

                const requestModel1 = {
                    ...requestModelStub,
                    chatId: "chatIdThreeStates",
                    stateInput: {
                        ...stateInputStub,
                        proceedEvent: 'moveToState2'
                    }
                }

                const requestModel2 = {
                    ...requestModelStub,
                    chatId: "chatIdThreeStates",
                    stateInput: {
                        ...stateInputStub,
                        proceedEvent: 'moveToState3'
                    }
                }

                describe('When the request models are sent to the use case sequentially', () => {
                    const usecase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayFlowWith3StatesMock, chatFlowGatewayWith3StatesMock);

                    it('should send a result model with next state for each request model', async () => {
                        await usecase.executeProceedInChat(requestModel1);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            ...expectedInResultModel,
                            chatEndStateId: 'state2Id',
                        }));
                        await usecase.executeProceedInChat(requestModel2);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            ...expectedInResultModel,
                            chatEndStateId: 'state3Id',
                        }));
                    });
                });
            });
        });
    }
}

const validationTest = new ProceedInChatUseCaseTest();
validationTest.runTests();