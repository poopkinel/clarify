import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";
import ProceedInChatUseCaseBaseTest from "./proceedInChatUseCaseTestBase";

class ProceedInChatUseCaseProcessInputTest extends ProceedInChatUseCaseBaseTest {
    runTests() {
        // expect that the out boundary is called with the event corresponding to the chat input validator
        describe('Given an usecaseOutBoundarySpy, a chatGateway stub, chatFlowGateway stub, usecase stub', () => {
            const nextStateAfterEmptyEventStateIdStub = {
                ...this.nextStateStub,
                id: 'afterEmptyEventStateId'
            }

            const nextStateResultStub = {
                success: true,
                nextState: nextStateAfterEmptyEventStateIdStub
            }

            const chatFlowGatewayStub = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue(nextStateResultStub)
                })
            }

            const usecaseJson = {
                usecaseOutBoundary: this.usecaseOutBoundarySpy,
                chatGatewayToProceedInChat: this.chatGatewayStub,
                chatFlowGateway: chatFlowGatewayStub
            }

            describe('Given a request model stub with input validated on empty event', () => {
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

                const requestModelStub = {
                    chatId: 'chatId',
                    userId: 'userId',
                    stateInput: {
                        response: responseStub
                    }
                }
                it('should call the out boundary with a result model containing the state for an empty event input', async () => {
                    const usecase = ProceedInChatUseCase.fromJson(usecaseJson);
                    await usecase.executeProceedInChat(requestModelStub);
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatNextStateId: 'afterEmptyEventStateId'
                    }));
                });
            });
        });
    }
}

const proceedInChatUseCaseProcessInputTest = new ProceedInChatUseCaseProcessInputTest();
proceedInChatUseCaseProcessInputTest.runTests();