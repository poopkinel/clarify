import { response } from "express"
import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase"

class ProceedInChatUseCaseGetChatReponseOptionsTest {
    runTests() {
        describe('Given a spy usecaseOutBoundarySpy, chatGateway stub, chatFlowGateway stub, usecase stub and request model stub', () => {
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

            const nextStateStub = {
                id: 'nextState',
                participator1State: 'state',
                participator2State: 'state',
                proceedEvent: 'event',
                responseOptions: []
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
                            responseOptions: []
                        }
                        ));
                    })
                })
            })

            describe('Given a chatFlowGateway returning a dummy chat state with 1 option', () => {
                const chatFlowGatewayOneOptionStub = {
                    ...chatFlowGatewayStub,
                    getChatFlowById: jest.fn().mockResolvedValue({
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...nextStateResultStub,
                            nextState: {
                                ...nextStateStub,
                                responseOptions: ["1"]
                            }
                        })
                    })
                }
                describe('When a request model for chat options is sent', () => {
                    const requestModel = {
                        ...requestModelStub,
                        chatId: 'chatOnly1OptionId'
                    }
                    it('usecase should be called with a result containing a list with 1 option', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...usecaseStubJson,
                            chatFlowGateway: chatFlowGatewayOneOptionStub
                        });
                        await usecase.executeProceedInChat(requestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            responseOptions: ["1"]
                        }));
                    });
                });
            });

            describe('Given a chatFlowGateway returning a stub chat state with 2 options', () => {
                const chatFlowGatewayTwoOptionStub = {
                    ...chatFlowGatewayStub,
                    getChatFlowById: jest.fn().mockResolvedValue({
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...nextStateResultStub,
                            nextState: {
                                ...nextStateStub,
                                responseOptions: ["1", "2"]
                            }
                        })
                    })
                }
                describe('When a request model for chat options is sent', () => {
                    const requestModel = {
                        ...requestModelStub,
                        chatId: 'chat2OptionsId',
                        stateInput: {
                            ...stateInputStub,
                            responseOptions: ["1", "2"]
                        }
                    }
                    it('usecase should be called with a result containing a list with 2 options', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...usecaseStubJson,
                            chatFlowGateway: chatFlowGatewayTwoOptionStub
                        })
                        await usecase.executeProceedInChat(requestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            responseOptions: ["1", "2"]
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