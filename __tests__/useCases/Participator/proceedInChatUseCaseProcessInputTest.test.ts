import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";
import ProceedInChatUseCaseBaseTest from "./proceedInChatUseCaseTestBase";

class ProceedInChatUseCaseProcessInputTest extends ProceedInChatUseCaseBaseTest {
    runTests() {
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
                chatFlowGateway: chatFlowGatewayStub,
                validationGateway: this.validationGatewayStub
            }

            describe('Given a request model stub with input validated on successful stub event', () => {          
                const responseStub = {
                    responseMedia: 'text',
                    responseContent: '',
                    eventValidationResult: this.eventValidationResultStub
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

            describe('Given a request model stub with input validated on failed stub event', () => {
                it('should call the out boundary with a result model containing error and succes set to false', async () => {                    
                    const responseWithErrorStub = {
                        responseMedia: 'text',
                        responseContent: 'content inavalidated for event',
                    }

                    const requestModelWithInvalidResponseContentStub = {
                        chatId: 'chatId',
                        userId: 'userId',
                        stateInput: {
                            response: responseWithErrorStub
                        }
                    }

                    const eventValidationResultWithErrorStub = {
                        ...this.eventValidationResultStub,
                        success: false,
                        error: 'Content invalid for event',
                        event: ''
                    }
        
                    const validationGatewayWithErrorStub = {
                        validateResponseEvent: jest.fn().mockResolvedValue(eventValidationResultWithErrorStub)
                    }

                    const usecase = ProceedInChatUseCase.fromJson({
                        ...usecaseJson,
                        validationGateway: validationGatewayWithErrorStub
                    });
                    await usecase.executeProceedInChat(requestModelWithInvalidResponseContentStub);
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        errors: ['Content invalid for event'],
                        chatNextStateId: ''
                    }));
                })
            });
        });
    }
}

const proceedInChatUseCaseProcessInputTest = new ProceedInChatUseCaseProcessInputTest();
proceedInChatUseCaseProcessInputTest.runTests();