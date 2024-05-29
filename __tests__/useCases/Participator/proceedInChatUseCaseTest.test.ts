import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";
import ProceedInChatRequestModel from "../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel";

class ProceedInChatUseCaseTest {
    runTests() {
        const usecaseOutBoundarySpy = {
            sendResultModel: jest.fn()
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

        const requestModelStub = {
            chatId: 'chatId', 
            userId: 'userId1', 
            stateInput: {
            participator1State: 'state',
            participator2State: 'state',
            proceedEvent: 'event'
            }
        }

        const chatFlowGatewayStub = {
            getChatFlowById: jest.fn().mockResolvedValue({
                getNextState: jest.fn().mockResolvedValue('state2Id')
            })
        }

        const chatGatewayResultModelStub = {
            success: true,
            chat: chatStub
        }

        const chatGatewayStub = {
            getChatById: jest.fn().mockResolvedValue(chatGatewayResultModelStub)
        }

        describe('Given an empty chat flow gateway stub', () => {
            const chatFlowGatewayOneStateStub = {
                ...chatFlowGatewayStub,
                getChatFlowById: jest.fn().mockResolvedValue({
                    getNextState: jest.fn().mockResolvedValue('start-finish')
                })
            };

            describe('When a valid request model is sent to the use case', () => {
                it('should send a chat finished result model with the same state', async () => {
                    const usecase = new ProceedInChatUseCase(usecaseOutBoundarySpy, chatGatewayStub, chatFlowGatewayOneStateStub);
                    await usecase.executeProceedInChat(requestModelStub);
                    
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
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
                    participator1State: 'state1',
                    participator2State: 'state1',
                    proceedEvent: 'moveToState2'
                }
            }

            const gatewayStubWithEventMoveToState2 = {
                getChatById: jest.fn().mockResolvedValue({
                    ...chatGatewayResultModelStub,
                    chat: {
                        ...chatStub,
                        currentState: {
                            participator1State: 'state1',
                            participator2State: 'state1',
                            proceedEvent: 'moveToState2'
                        }
                    }
                })
            }
            describe('When the request model is sent to the use case', () => {
                it('should send a result model with the transitioned new state', async () => {

                    const chatFlowGatewayStub = {
                        getChatFlowById: jest.fn().mockResolvedValue({
                            getNextState: jest.fn().mockResolvedValue('state2Id')
                        })
                    }

                    const usecase = new ProceedInChatUseCase(usecaseOutBoundarySpy, gatewayStubWithEventMoveToState2, chatFlowGatewayStub);
                    await usecase.executeProceedInChat(requestModelTwoStatesChatFlow);
                    
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatEndStateId: 'state2Id',
                    }));
                });
            });
        });
    }
}

const validationTest = new ProceedInChatUseCaseTest();
validationTest.runTests();