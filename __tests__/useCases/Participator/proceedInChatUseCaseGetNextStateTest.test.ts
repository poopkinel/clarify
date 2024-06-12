import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";
import ProceedInChatUseCaseBaseTest from "./proceedInChatUseCaseTestBase";

class ProceedInChatUseCaseTest extends ProceedInChatUseCaseBaseTest{
    runTests() {
        const responseStub = {
            responseMedia: 'text',
            responseContent: '',
        }
        
        const stateInputStub = {
            stateId: 'stateId',
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

        describe('Given a valid request model and a chat with 2 states', () => {
            describe('When the request model is sent to the use case', () => {
                it.only('should send a result model with the transitioned new state', async () => {
                    const setupData = {
                        ...this.setupData,
                        chatId: 'chatIdTwoStates',
                        validatedEvent: 'moveToState2',
                        nextStateId: 'nextState',
                        proceedEvent: 'moveToState2',
                    }

                    const { usecase, requestModel } = this.generateUsecaseAndRequestModelBasedOnSetupDataForSingleRequestSingleParticipator(setupData);
                    await usecase.executeProceedInChat(requestModel);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        ...expectedInResultModel,
                        chatNextStateId: 'nextState',
                    }));
                });
            });

            describe('Given a chat flow with 3 states and 2 valid request models', () => {
                var requestsCounter = 0;
                const chatGatewayFlowWith3StatesMock = {
                    getChatById: jest.fn().mockResolvedValue(this.chatGatewayResultModelStub)
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
                    ...this.chatFlowGatewayStub_OLD,
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
                    validateResponse: jest.fn().mockImplementation(() => {
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