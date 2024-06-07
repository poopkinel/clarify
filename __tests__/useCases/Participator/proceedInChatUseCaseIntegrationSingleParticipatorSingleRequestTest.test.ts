import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';

class ProceedInChatUseCaseIntegrationSingleParticipatorSingleRequestTest extends ProceedInChatUseCaseBaseTest {
    runTests() {
        describe('Test flow for single pariticpant and single request', () => {
            describe('Given dummy response options, and dummy isEndState value for the dummy next state', () => {
                describe('Given dummy getNextState method giving the same dummy state as current state (with dummy event)', () => {
                    describe('Given a dummy current state and success nextStateResult', () => {
                        describe('Given dummy content and success validation result', () => {
                            it('should call out boundary with result model value isEnd: dummy and responseOptions: based on dummy nextState ', async () => {
                                await this.executeUsecaseWithSetupData();
                                
                                expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                    isEndState: true,
                                    responseOptionsForParticipant: {
                                        options: []
                                    }
                                }));
                            });
                        });
                        describe('Given non dummy content, and error validation result', () => {
                            it('should call boundry with result model containing error for content event', async () => {
                                const setupData = {
                                    ...this.setupData,
                                    content: 'invalidContent',
                                    validateResultSuccess: false,
                                    validateResultError: 'Content invalid for event'
                                }

                                await this.executeUsecaseWithSetupData(setupData);

                                expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                    errors: expect.arrayContaining(['Content invalid for event'])
                                }));
                            });
                        });
                    });
                    describe('Given non dummy current state, and failed nextStateResult', () => {
                        describe('Given dummy content and success validation result', () => {
                            it('should call out boundary with result model containing error for chat state', async () => {
                                const setupData = {
                                    ...this.setupData,
                                    currentStateId: 'different current state id',
                                    nextStateResultSuccess: false,
                                    nextStateResultError: 'Invalid chat state'
                                }

                                await this.executeUsecaseWithSetupData(setupData);

                                expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                    errors: expect.arrayContaining(['Invalid chat state'])
                                }));
                            });
                        });
                        describe('Given non dummy content', () => {
                            it('should call out boundary with result model containing errors for chat state and content event', async () => {
                                const setupData = {
                                    ...this.setupData,
                                    currentStateId: 'different current state id',
                                    nextStateResultSuccess: false,
                                    nextStateResultError: 'Invalid chat state',
                                    content: 'invalidContent',
                                    validateResultSuccess: false,
                                    validateResultError: 'Content invalid for event'
                                }

                                await this.executeUsecaseWithSetupData(setupData);

                                expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                    errors: expect.arrayContaining(['Invalid chat state', 'Content invalid for event'])
                                }));
                            });
                        });
                    });
                    describe('Given a failed getNextState method giving a different state than the dummy next state', () => {
                        it('should call out boundary with result model containing error for chat state', async () => {
                            const setupData = {
                                ...this.setupData,
                                nextStateId: 'different next state id',
                                nextStateResultSuccess: false,
                                nextStateResultError: 'Invalid chat state'
                            }

                            await this.executeUsecaseWithSetupData(setupData);

                            expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                errors: expect.arrayContaining(['Invalid chat state'])
                            }));
                        });
                    });
                });
                describe('Given a success getNextState with a different state than the dummy current state', () => {
                    it('should call out boundary with result model containing error for chat state', async () => {
                        const setupData = {
                            ...this.setupData,
                            nextStateId: 'different next state id',
                            nextStateResultSuccess: true
                        }

                        await this.executeUsecaseWithSetupData(setupData);

                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            errors: []
                        }));
                    });
                });
            });
            describe('Given non dummy response options, and dummy isEndState value for the dummy next state', () => {
                it('should call out boundary with result model containing the non dummy response options', async () => {
                    const setupData = {
                        ...this.setupData,
                        responseOptions: {
                            options: [{
                                responseMedia: {
                                    media: 'text'
                                },
                                responseRestrictions: {
                                    validatorId: 'ValidatorId'
                                }
                            }]
                        }
                    }

                    await this.executeUsecaseWithSetupData(setupData);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        errors: [],
                        responseOptionsForParticipant: {
                            options: [{
                                responseMedia: 'text',
                                responseRestrictions: 'ValidatorId'
                            }]
                        }
                    }));
                });
            });
            describe('Given a non dummy response isEndState value', () => {
                it('should call out boundary with result model containing the non dummy isEndState value', async () => {
                    const setupData = {
                        ...this.setupData,
                        isEndState: false
                    }

                    await this.executeUsecaseWithSetupData(setupData);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        isEndState: false
                    }));
                });
            });
        }); 
    }

    private async executeUsecaseWithSetupData(setupData = this.setupData) {
        const { usecase, requestModel } = this.generateUsecaseAndRequestModelBasedOnSetupData(setupData);
        return await usecase.executeProceedInChat(requestModel);
    }

    setupData = {
        content: 'dummyContent', 
        event: 'dummyEvent',
        validateResultSuccess: true,
        validateResultError: '',
        currentStateId: 'dummyStateId',
        nextStateResultSuccess: true,
        nextStateId: 'dummyStateId',
        nextStateResultError: '',
        proceedEvent: 'dummyEvent',
        isEndState: true,
        responseOptions: { options: null } as any
    }

    private generateUsecaseAndRequestModelBasedOnSetupData(setup = this.setupData) {
        const { 
            requestModel, 
            validationGateway, 
            chatGateway, 
            chatFlowGateway
            } = this.arrangeMainExecutionFlowForSingleParticipant(setup);
        const usecase = ProceedInChatUseCase.fromJson({
            usecaseOutBoundary: this.usecaseOutBoundarySpy,
            chatGatewayToProceedInChat: chatGateway,
            chatFlowGateway: chatFlowGateway,
            validationGateway: validationGateway
        });

        return { usecase, requestModel };
    }

    private arrangeMainExecutionFlowForSingleParticipant(setup = this.setupData) {
        const userIdDummy = 'userId';
        const contentDummy = setup.content;
        const requestModel = {
            chatId: 'chatId',
            userId: userIdDummy,
            stateInput: {
                stateId: 'stateId', // irrelevant atm
                response: {
                    responseMedia: 'text',
                    responseContent: contentDummy
                }
            }
        }

        const validationGateway = {
            ...this.validationGatewayStub,
            validateResponse: jest.fn().mockImplementation(() => {
                return {
                    ...this.eventValidationResultStub,
                    success: setup.validateResultSuccess,
                    error: setup.validateResultError,
                    event: setup.event
                }
            })
        }

        const chatGateway = {
            ...this.chatGatewayStub,
            getChatById: jest.fn().mockResolvedValue({
                ...this.chatGatewayResultModelStub,
                chat: {
                    ...this.chatStub,
                    currentState: {
                        ...this.currentStateStub,
                        id: setup.currentStateId
                    }
                }
            })
        }

        const chatFlowGateway = {
            ...this.chatFlowGatewayStub,
            getChatFlowById: jest.fn().mockResolvedValue({
                tryGetNextState: jest.fn().mockImplementation(() => {
                    return {
                        ...this.nextStateResultStub,
                        success: setup.nextStateResultSuccess,
                        error: setup.nextStateResultError,
                        nextState: {
                            ...this.nextStateStub,
                            id: setup.nextStateId,
                            proceedEvent: setup.proceedEvent,
                            participator1Options: setup.responseOptions,
                            participator2Options: setup.responseOptions,
                            isEndState: setup.isEndState
                        }
                    }
                })
            })
        }

        return { requestModel, validationGateway, chatGateway, chatFlowGateway };
    }
}

const test = new ProceedInChatUseCaseIntegrationSingleParticipatorSingleRequestTest();
test.runTests();