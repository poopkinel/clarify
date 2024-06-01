import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";

class ProceedInChatUseCaseProcessInputTest {
    runTests() {
        // expect that the out boundary is called with the event corresponding to the chat input validator
        describe('Given an usecaseOutBoundarySpy, a chatGateway stub, chatFlowGateway stub, usecase stub', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }
            const usecaseJson = {
                usecaseOutBoundary: usecaseOutBoundarySpy,
                chatGatewayToProceedInChat: {
                    getChatById: jest.fn().mockResolvedValue({
                        success: true,
                        chat: {
                            currentState: {
                                participator1State: 'state',
                                participator2State: 'state',
                                proceedEvent: 'event'
                            },
                            participator1UserId: 'userId',
                            participator2UserId: 'userId2',
                        }
                    })
                },
                chatFlowGateway: {
                    getChatFlowById: jest.fn().mockResolvedValue({
                        tryGetNextState: jest.fn().mockResolvedValue({
                            success: true,
                            nextState: {
                                id: 'afterEmptyEventStateId',
                                participator1State: 'state',
                                participator2State: 'state',
                                proceedEvent: 'event',
                                responseOptions: []
                            }
                        })
                    })
                }
            }

            describe.only('Given a request model stub with input validated on empty event', () => {
                const requestModelStub = {
                    chatId: 'chatId',
                    userId: 'userId',
                    stateInput: {
                        response: {
                            responseMedia: 'text',
                            responseContent: '',
                            eventValidationResult: {
                                success: true,
                                error: '',
                                event: 'event'
                            }
                        }
                    }
                }
                it('should call the out boundary with a result model containing the state for an empty event input', async () => {
                    const usecase = ProceedInChatUseCase.fromJson(usecaseJson);
                    await usecase.executeProceedInChat(requestModelStub);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatNextStateId: 'afterEmptyEventStateId'
                    }));
                });
            });
        });
    }
}

const proceedInChatUseCaseProcessInputTest = new ProceedInChatUseCaseProcessInputTest();
proceedInChatUseCaseProcessInputTest.runTests();