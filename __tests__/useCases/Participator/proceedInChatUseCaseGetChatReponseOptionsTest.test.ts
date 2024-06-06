import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase"
import ChatReponseOptions from "../../../src/entities/responseOption/chatResponseOptions"
import ProceedInChatUseCaseBaseTest from "./proceedInChatUseCaseTestBase"

class ProceedInChatUseCaseGetChatReponseOptionsTest extends ProceedInChatUseCaseBaseTest {
    runTests() {
        describe('Given a usecaseOutBoundarySpy, chatGateway stub, chatFlowGateway stub, usecase stub and request model stub', () => {                     
            const stateInputStub = {
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

            const requestModelStub = {
                chatId: 'chatId',
                userId: this.userIdStub,
                stateInput: stateInputStub
            }

            describe('Given a chatFlowGateway returning a dummy chat state with empty options', () => {
                const chatFlowGatewayEmptyOptionsStub = {
                    ...this.chatFlowGatewayStub,
                    getChatFlowById: jest.fn().mockResolvedValue({
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...this.nextStateResultStub,
                            nextState: {
                                ...this.nextStateStub,
                                participator1Options: {
                                    options: null
                                },
                                participator2Options: {
                                    options: null
                                }
                            }
                        })
                    })
                }
                describe('When a request model for chat options is sent', () => {
                    it('usecase should be called with a result containing an empty list', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...this.usecaseStubJson,
                            chatFlowGateway: chatFlowGatewayEmptyOptionsStub
                        });
                        await usecase.executeProceedInChat(requestModelStub);
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            responseOptionsForParticipant: {
                                options: [] as {
                                    responseMedia: string,
                                    responseRestrictions: string
                                }[]
                            }
                        }));
                    })
                })
            })

            const setupChatFlowGatewayStub = (
                responseOptionsP1: ChatReponseOptions, responseOptionsP2: ChatReponseOptions
            ) => {
                return {
                    ...this.chatFlowGatewayStub,
                    getChatFlowById: jest.fn().mockResolvedValue({
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...this.nextStateResultStub,
                            nextState: {
                                ...this.nextStateStub,
                                participator1Options: responseOptionsP1,
                                participator2Options: responseOptionsP2
                            }
                        })
                    })
                }
            }

            const responseOptionsP1Stub = {
                options: [{
                    responseMedia: {
                        media: 'text'
                    },
                    responseRestrictions: {
                        validatorId: 'CantBeQuestionValidatorId'
                    }
                }]
            }

            const responseOptionsP2Stub = {
                options: null
            }

            const responseOptionsP1ResultStub = {
                options: [{
                    responseMedia: 'text',
                    responseRestrictions: 'CantBeQuestionValidatorId'
                }]
            }
            
            describe('Given a chatFlowGateway returning a dummy chat state with 1 option per participant', () => {
                const chatFlowGatewayOneOptionStub = setupChatFlowGatewayStub(
                    responseOptionsP1Stub,
                    responseOptionsP2Stub
                );

                describe('When a request model for chat options is sent', () => {
                    const requestModel = requestModelStub;

                    it('usecase should be called with a result containing a list with 1 option', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...this.usecaseStubJson,
                            chatFlowGateway: chatFlowGatewayOneOptionStub
                        });
                        await usecase.executeProceedInChat(requestModel);
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                responseOptionsForParticipant: responseOptionsP1ResultStub,
                        }));
                    });
                });
            });

            describe('Given a chatFlowGateway returning a stub chat state with 2 options', () => {
                const chatFlowGatewayTwoOptionStub = setupChatFlowGatewayStub(
                    {
                        options: null
                    }
                    ,{
                        options: [{
                            responseMedia: {
                                media: 'text'
                            },
                            responseRestrictions: {
                                validatorId: 'CantBeQuestionValidatorId'
                            }
                        }, {
                            responseMedia: {
                                media: 'image'
                            },
                            responseRestrictions: {
                                validatorId: 'CantBeQuestionValidatorId'
                            }
                        
                        }]
                    }
                );

                describe('When a request model for chat options is sent', () => {
                    const requestModel = {
                        ...requestModelStub,
                        userId: 'participator2Id',
                        chatId: 'chat2OptionsId',
                        stateInput: stateInputStub
                    }

                    const chatGatewayWithParticipator2IdStub = {
                        ...this.chatGatewayStub,
                        getChatById: jest.fn().mockResolvedValue({
                            ...this.chatGatewayResultModelStub,
                            chat: {
                                ...this.chatStub,
                                participator2UserId: 'participator2Id'
                            }
                        })
                    }

                    it('usecase should be called with a result containing a list with 2 options', async () => {
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...this.usecaseStubJson,
                            chatGatewayToProceedInChat: chatGatewayWithParticipator2IdStub,
                            chatFlowGateway: chatFlowGatewayTwoOptionStub
                        })
                        await usecase.executeProceedInChat(requestModel);
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            responseOptionsForParticipant: {
                                options: [{
                                    responseMedia: 'text',
                                    responseRestrictions: 'CantBeQuestionValidatorId'
                                }, {
                                    responseMedia: 'image',
                                    responseRestrictions: 'CantBeQuestionValidatorId',                                
                                }]
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