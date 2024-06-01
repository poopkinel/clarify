import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";
import ProceedInChatUseCaseBaseTest from "./proceedInChatUseCaseTestBase";

class ProceedInChatUseCaseTest extends ProceedInChatUseCaseBaseTest{
    runTests() {
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
            userId: this.userIdStub, 
            stateInput: stateInputStub
        }

        const expectedInResultModel = {
            errors: [],
            chatNextStateId: 'nextState'
        };

        describe('Given an empty chat flow gateway stub', () => {
            const chatFlowGatewayOneStateStub = {
                ...this.chatFlowGatewayStub,
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...this.nextStateResultStub,
                        nextState: {
                            id: 'start-finish'
                        }
                    })
                })
            };

            describe('When a valid request model is sent to the use case', () => {
                it('should send a chat finished result model with the same state', async () => {
                    const usecase = new ProceedInChatUseCase(this.usecaseOutBoundarySpy, this.chatGatewayStub, chatFlowGatewayOneStateStub);
                    await usecase.executeProceedInChat(requestModelStub);
                    
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
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
                    ...this.chatGatewayResultModelStub,
                    chat: {
                        ...this.chatStub,
                        currentState: {
                            ...this.currentStateStub,
                            proceedEvent: 'moveToState2'
                        }
                    }
                })
            }

            const chatFlowGatewayTwoStatesStub = {
                ...this.chatFlowGatewayStub,
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            id: 'nextState'
                        }
                    })
                })
            };

            describe('When the request model is sent to the use case', () => {
                it('should send a result model with the transitioned new state', async () => {
                    const usecase = new ProceedInChatUseCase(this.usecaseOutBoundarySpy, gatewayStubWithEventMoveToState2, chatFlowGatewayTwoStatesStub);
                    await usecase.executeProceedInChat(requestModelTwoStatesChatFlow);
                    
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        ...expectedInResultModel,
                        chatNextStateId: 'nextState',
                    }));
                });
            });

            describe('Given a chat flow with 3 states and 2 valid request models', () => {
                var requestsCounter = 0;
                const setupChatGatewayResultModelStub = (counter: number) => {
                    return {
                        ...this.chatGatewayResultModelStub,
                        chat: {
                            ...this.chatStub,
                            currentState: {
                                ...this.currentStateStub,
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
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            id: `state${counter + 2}Id`,
                            proceedEvent: `moveToState${counter + 2}`
                        }
                    }   
                }
                const chatFlowGatewayWith3StatesMock = {
                    ...this.chatFlowGatewayStub,
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
                    const usecase = new ProceedInChatUseCase(this.usecaseOutBoundarySpy, chatGatewayFlowWith3StatesMock, chatFlowGatewayWith3StatesMock);

                    it('should send a result model with next state for each request model', async () => {
                        await usecase.executeProceedInChat(setupRequestModelStub(requestsCounter));
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            ...expectedInResultModel,
                            chatNextStateId: 'state2Id',
                        }));

                        requestsCounter++;

                        await usecase.executeProceedInChat(setupRequestModelStub(requestsCounter));
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
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