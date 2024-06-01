import { response } from "express";
import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";

class ProceedInChatUseCaseTest {
    runTests() {
        const usecaseOutBoundarySpy = {
            sendResultModel: jest.fn()
        }

        const eventValidationResultStub = {
            success: true,
            error: '',
            event: 'event'
        }

        const responseStub = {
            responseMedia: 'text',
            responseContent: '',
            eventValidationResult: eventValidationResultStub
        }
        
        const stateInputStub = {
            response: responseStub
        }
        
        const requestModelStub = {
            chatId: 'chatId', 
            userId: 'userId1', 
            stateInput: stateInputStub
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
            chatNextStateId: 'nextState'
        };

        const nextStateStub = {
            id: 'nextState',
            participator1State: 'state',
            participator2State: 'state',
            proceedEvent: 'event'
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

        describe('Given an empty chat flow gateway stub', () => {
            const chatFlowGatewayOneStateStub = {
                ...chatFlowGatewayStub,
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...nextStateResultStub,
                        nextState: {
                            id: 'start-finish'
                        }
                    })
                })
            };

            describe('When a valid request model is sent to the use case', () => {
                it('should send a chat finished result model with the same state', async () => {
                    const usecase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub, chatFlowGatewayOneStateStub);
                    await usecase.executeProceedInChat(requestModelStub);
                    
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        ...expectedInResultModel,
                        chatNextStateId: 'start-finish',
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
                    response: {
                        ...responseStub,
                        eventValidationResult: {
                            ...eventValidationResultStub,
                            event: 'moveToState2'
                        }
                    }
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

            const chatFlowGatewayTwoStatesStub = {
                ...chatFlowGatewayStub,
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...nextStateResultStub,
                        nextState: {
                            ...nextStateStub,
                            id: 'nextState'
                        }
                    })
                })
            };

            describe('When the request model is sent to the use case', () => {
                it('should send a result model with the transitioned new state', async () => {
                    const usecase = new ProceedInChatUseCase(usecaseOutBoundarySpy, gatewayStubWithEventMoveToState2, chatFlowGatewayTwoStatesStub);
                    await usecase.executeProceedInChat(requestModelTwoStatesChatFlow);
                    
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        ...expectedInResultModel,
                        chatNextStateId: 'nextState',
                    }));
                });
            });

            describe('Given a chat flow with 3 states and 2 valid request models', () => {
                var requestsCounter = 0;
                const setupChatGatewayResultModelStub = (counter: number) => {
                    return {
                        ...chatGatewayResultModelStub,
                        chat: {
                            ...chatStub,
                            currentState: {
                                ...chatCurrentStateStub,
                                proceedEvent: `moveToState${counter + 2}`
                            }
                        }
                    }
                }

                const chatGatewayFlowWith3StatesMock = {
                    getChatById: jest.fn().mockImplementation(() => setupChatGatewayResultModelStub(requestsCounter))
                }

                const setupNextStateStub = (counter: number) => {
                    return {
                        ...nextStateResultStub,
                        nextState: {
                            ...nextStateStub,
                            id: `state${counter + 2}Id`,
                            proceedEvent: `moveToState${counter + 2}`
                        }
                    }   
                }
                const chatFlowGatewayWith3StatesMock = {
                    ...chatFlowGatewayStub,
                    getChatFlowById: jest.fn().mockResolvedValue({
                        tryGetNextState: jest.fn().mockImplementation(() => setupNextStateStub(requestsCounter))
                    })
                }

                const setupRequestModelStub = (counter: number) => {
                    return {
                        ...requestModelStub,
                        chatId: "chatIdThreeStates",
                        stateInput: {
                            ...stateInputStub,
                            response: {
                                ...responseStub,
                                eventValidationResult: {
                                    ...eventValidationResultStub,
                                    event: `moveToState${counter + 2}`
                                }
                            }
                        }
                    }
                }

                describe('When the request models are sent to the use case sequentially', () => {
                    const usecase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayFlowWith3StatesMock, chatFlowGatewayWith3StatesMock);

                    it('should send a result model with next state for each request model', async () => {
                        await usecase.executeProceedInChat(setupRequestModelStub(requestsCounter));
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            ...expectedInResultModel,
                            chatNextStateId: 'state2Id',
                        }));

                        requestsCounter++;

                        await usecase.executeProceedInChat(setupRequestModelStub(requestsCounter));
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            ...expectedInResultModel,
                            chatNextStateId: 'state3Id',
                        }));
                    });
                });
            });
        });
    }
}

const validationTest = new ProceedInChatUseCaseTest();
validationTest.runTests();