import { response } from "express"
import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase"

class ProceedInChatUseCaseGetChatReponseOptionsTest {
    runTests() {
        describe('Given a usecaseOutBoundarySpy, chatGateway stub, chatFlowGateway stub, usecase stub and request model stub', () => {
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

            
            const responseOptionsStub = {
                resopnseOptionParticipant1: [],
                resopnseOptionParticipant2: []
            }

            const nextStateStub = {
                id: 'nextState',
                participator1State: 'state',
                participator2State: 'state',
                proceedEvent: 'event',
                responseOptions: responseOptionsStub
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
                            responseOptions: {
                                resopnseOptionParticipant1: [],
                                resopnseOptionParticipant2: []
                            }
                        }));
                    })
                })
            })

            const setupChatFlowGatewayStub = (responseOptionsP1: any, responseOptionsP2: any) => {
                return {
                    ...chatFlowGatewayStub,
                    getChatFlowById: jest.fn().mockResolvedValue({
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...nextStateResultStub,
                            nextState: {
                                ...nextStateStub,
                                responseOptions: {
                                    ...responseOptionsStub,
                                    resopnseOptionParticipant1: responseOptionsP1,
                                    resopnseOptionParticipant2: responseOptionsP2
                                }
                            }
                        })
                    })
                }
            }

            
            describe('Given a chatFlowGateway returning a dummy chat state with 1 option per participant', () => {
                const chatFlowGatewayOneOptionStub = setupChatFlowGatewayStub(["1"], ["2"]);

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
                            responseOptions: {
                                resopnseOptionParticipant1: ["1"],
                                resopnseOptionParticipant2: ["2"]
                            }
                        }));
                    });
                });
            });

            describe('Given a chatFlowGateway returning a stub chat state with 2 options', () => {
                const chatFlowGatewayTwoOptionStub = setupChatFlowGatewayStub(["1", "A"], ["2", "B"]);

                describe('When a request model for chat options is sent', () => {
                    const requestModel = {
                        ...requestModelStub,
                        chatId: 'chat2OptionsId',
                        stateInput: stateInputStub
                    }
                    it('usecase should be called with a result containing a list with 2 options', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...usecaseStubJson,
                            chatFlowGateway: chatFlowGatewayTwoOptionStub
                        })
                        await usecase.executeProceedInChat(requestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            responseOptions: {
                                resopnseOptionParticipant1: ["1", "A"],
                                resopnseOptionParticipant2: ["2", "B"]
                            }
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