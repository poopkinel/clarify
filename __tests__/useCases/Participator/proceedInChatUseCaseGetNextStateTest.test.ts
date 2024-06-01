import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";
import ProceedInChatUseCaseBaseTest from "./proceedInChatUseCaseTestBase";

class ProceedInChatUseCaseTest extends ProceedInChatUseCaseBaseTest{
    runTests() {
        const responseStub = {
            responseMedia: 'text',
            responseContent: '',
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
                    const usecase = ProceedInChatUseCase.fromJson({
                        usecaseOutBoundary: this.usecaseOutBoundarySpy, 
                        chatGatewayToProceedInChat: this.chatGatewayStub, 
                        chatFlowGateway: chatFlowGatewayOneStateStub,
                        validationGateway: this.validationGatewayStub
                    });
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
                chatId: "chatIdTwoStates"
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

            const validationGatewayWithEventMoveToState2Stub = {
                ...this.validationGatewayStub,
                validateResponseEvent: jest.fn().mockImplementation(() => {
                    return {
                        ...this.eventValidationResultStub,
                        event: 'moveToState2'
                    }
                })
            }

            describe('When the request model is sent to the use case', () => {
                it('should send a result model with the transitioned new state', async () => {
                    const usecase = ProceedInChatUseCase.fromJson({
                        usecaseOutBoundary: this.usecaseOutBoundarySpy, 
                        chatGatewayToProceedInChat: gatewayStubWithEventMoveToState2, 
                        chatFlowGateway: chatFlowGatewayTwoStatesStub,
                        validationGateway: validationGatewayWithEventMoveToState2Stub
                    });
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
                        chatId: "chatIdThreeStates"
                    }
                }

                const validationGatewayWithCounterStub = {
                    ...this.validationGatewayStub,
                    validateResponseEvent: jest.fn().mockImplementation(() => {
                        return {
                            ...this.eventValidationResultStub,
                            event: `moveToState${requestsCounter + 2}`
                        }
                    })
                }

                describe('When the request models are sent to the use case sequentially', () => {
                    const usecase = ProceedInChatUseCase.fromJson({
                        usecaseOutBoundary: this.usecaseOutBoundarySpy, 
                        chatGatewayToProceedInChat: chatGatewayFlowWith3StatesMock, 
                        chatFlowGateway: chatFlowGatewayWith3StatesMock,
                        validationGateway: validationGatewayWithCounterStub
                    });

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