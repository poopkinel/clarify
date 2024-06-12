import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';
import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';
import ProceedInChatRequestModel from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel';

type ParticipatorResponseOptions = {
    options: {
        responseMedia: {
            media: string;
        };
        responseRestrictions: {
            validatorId: string;
        };
    }[] | null;
};

type ParticipatorResponseOptionsResults = { 
    options: { 
        responseMedia: string; 
        responseRestrictions: string; 
    }[]; 
}

class ProceedInChatUseCaseIntegrationTest extends ProceedInChatUseCaseBaseTest{
    runTests() {
        const requestModelStub = {
            chatId: 'chatId',
            userId: this.userIdStub,
            stateInput: {
                stateId: 'stateId',
                response: {
                    responseMedia: 'text',
                    responseContent: '',
                }
            }
        }

        const participatorOptionsEmpty = this.setupResponseOptions('', '', true);

        const responseOptionEmptyInResultModel = this.setupResponseOptionsResults('', '', true);

        const participatorOptionsFull = this.setupResponseOptions('text', 'ValidatorId'); 


        const paricipator1OptionsForEachState = [
            participatorOptionsFull,
            participatorOptionsEmpty,
            participatorOptionsEmpty
        ];

        const paricipator2OptionsForEachState = [
            participatorOptionsEmpty,
            participatorOptionsFull,
            participatorOptionsFull
        ];

        const responseOptionsFullInResultModel = this.setupResponseOptionsResults('text', 'ValidatorId'); 

        const expectedP1ResponseOptionsForEachState = [
            responseOptionsFullInResultModel,
            responseOptionEmptyInResultModel,
            responseOptionEmptyInResultModel
        ]

        const expectedP2ResponseOptionsForEachState = [
            responseOptionEmptyInResultModel,
            responseOptionsFullInResultModel,
            responseOptionsFullInResultModel,
        ]

        const eventsToProceedInChatSameEvent = ["event", "event", "event"];

        describe.skip('Given a request model stub and empty response options stub', () => {

            const chatFlowGatewayEmptyOptionsStub = this.setupChatFlowGatewayWithOptions(participatorOptionsEmpty)

            describe('When usecase is called with request model', () => {
                
                it('should be called with next state and empty response options', async () => {
                    const usecase = this.setupUsecase(chatFlowGatewayEmptyOptionsStub);
                    await usecase.executeProceedInChat(requestModelStub);
                    const expectedResultModel = this.setupExpectedResultModel()

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(
                        expectedResultModel
                    ));
                });
            });
        });

        describe.skip('Given a request model stub and non-empty response options stub', () => {
            const responseOptionsP1OnlyStub = this.setupResponseOptions('text', 'CantBeQuestionValidatorId');
            const chatFlowGatewayStub = this.setupChatFlowGatewayWithOptions(responseOptionsP1OnlyStub, participatorOptionsEmpty);

            describe('When usecase is called with request model', () => {
                
                it('should be called with next state and non-empty response options', async () => {
                    const usecase = this.setupUsecase(chatFlowGatewayStub);
                    await usecase.executeProceedInChat(requestModelStub);

                    const expectedResponseOptions = this.setupResponseOptionsResults('text', 'CantBeQuestionValidatorId');
                    const expectedResultModel = this.setupExpectedResultModel(expectedResponseOptions)

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(
                        expectedResultModel
                    ));
                });
            });
        });

        
        describe.skip('Given a mock chatFlowGateway with stub request models and response options', () => {
            var chatCounter: number;
            const chatFlowGatewayMock = {
                getChatFlowById: jest.fn().mockImplementation(async () => {
                    const participator1OptionsFull = this.setupResponseOptions('text', 'CantBeQuestionValidatorId');
                    const paricipator1OptionsForEachState = this.setupParticipator1OptionsForEachState(participator1OptionsFull, participatorOptionsEmpty);
                    const nextState = this.setupNextState(chatCounter, paricipator1OptionsForEachState)
                    
                    return {
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...this.nextStateResultStub,
                            nextState: nextState
                        })
                    }
                })
            }
            describe('And given an expected result model', () => {
                describe('When usecase is called with request model', () => {
                    const requestModel = requestModelStub;
                    const expectedResponseOptionsFull = this.setupResponseOptionsResults('text', 'CantBeQuestionValidatorId');

                    it('should be called with next state and response options according to sequence', async () => {
                        const usecase = this.setupUsecase(chatFlowGatewayMock);
                        const expectedResponseOptionsForEachState = this.setupResponseOptionsResultsForEachState(expectedResponseOptionsFull, responseOptionEmptyInResultModel)

                        chatCounter = 0;
                        for (let i = 0; i < expectedResponseOptionsForEachState.length; i++) {
                            await usecase.executeProceedInChat(requestModel);
                            chatCounter++;
                            this.expectOptionsForState(`state${i}`, expectedResponseOptionsForEachState[i], this.usecaseOutBoundarySpy);
                        }
                    });
                });
            });
        });

        describe.skip('Given a mock chatFlowGateway for both participators', () => {
            var chatCounter: number;
            const chatFlowGatewayMock = {
                getChatFlowById: jest.fn().mockImplementation(async () => {
                    const nextState = this.setupNextStateByCounter(
                        chatCounter, paricipator1OptionsForEachState, paricipator2OptionsForEachState, 
                        eventsToProceedInChatSameEvent
                    )
                    
                    return {
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...this.nextStateResultStub,
                            nextState: nextState
                        })
                    }
                })
            }
            describe('Given an expected result model', () => {
                describe('When usecase is called with the correct request models sequence alternating between the participators', () => {
                    const participator1UserId = this.userIdStub;
                    const participator2UserId = this.stubParticipator2UserId;

                    const requestModelsP1WithContentStubs = (chatCounter: number) => {
                        return this.setupRequestModel(chatCounter, participator1UserId, `content${chatCounter}`)
                    }

                    const requestModelsP2WithContentStubs = (chatCounter: number) => {
                        return this.setupRequestModel(chatCounter, participator2UserId, `content${chatCounter}`)
                    }

                    it('should be called with next state and response options according to sequence', async () => {
                        const usecase = this.setupUsecase(chatFlowGatewayMock);

                        for (chatCounter = 0; chatCounter < expectedP1ResponseOptionsForEachState.length; chatCounter++) {
                            await usecase.executeProceedInChat(requestModelsP1WithContentStubs(chatCounter));
                            this.expectOptionsForState(`state${chatCounter}`, expectedP1ResponseOptionsForEachState[chatCounter], this.usecaseOutBoundarySpy);

                            await usecase.executeProceedInChat(requestModelsP2WithContentStubs(chatCounter));
                            this.expectOptionsForState(`state${chatCounter}`, expectedP2ResponseOptionsForEachState[chatCounter], this.usecaseOutBoundarySpy);
                        }
                    });
                });

                describe('Given a validation gateway with an event validation result', () => {
                    const eventValidationResultsForEachState = this.setupValidationResultsForEachState();

                    const validationGatewayEventsSequenceStub = {
                        validateResponse: jest.fn().mockImplementation((response: {
                            responseMedia: string;
                            responseContent: string;
                        }) => {
                            const eventValidationResultIndex = response.responseContent[response.responseContent.length - 1]
                            return eventValidationResultsForEachState[Number(eventValidationResultIndex)];
                        })
                    }

                    const chatFlowGatewayMock = {
                        getChatFlowById: jest.fn().mockImplementation(async () => {                                           
                            const nextState = this.setupNextStateByCounter(
                                chatCounter, paricipator1OptionsForEachState, paricipator2OptionsForEachState)
                            
                            return {
                                tryGetNextState: jest.fn().mockResolvedValue({
                                    ...this.nextStateResultStub,
                                    nextState: nextState
                                })
                            }
                        })
                    }

                    describe('Given the request models and expected result models for each state', () => {
                        const participator1UserId = this.userIdStub;
                        
                        const requestModelsP1WithContentStubs = this.setupRequestModelsWithContent(chatCounter, participator1UserId)

                        it('should call according to sequence of validation results', async () => {
                            const usecase = this.setupUsecase(chatFlowGatewayMock, validationGatewayEventsSequenceStub);

                            for (chatCounter = 0; chatCounter < eventValidationResultsForEachState.length; chatCounter++) {
                                await usecase.executeProceedInChat(requestModelsP1WithContentStubs[chatCounter]);
                                this.expectOptionsForState(`state${chatCounter}`, expectedP1ResponseOptionsForEachState[chatCounter], this.usecaseOutBoundarySpy);
                            }
                        });
                    });
                });
            });
        });

        describe.skip('Full chat flow with 3 states and 2 participators', () => {
            var chatCounter: number;
            describe('Given a mock chat gateway with updating current state for chat', () => {
                const chatGatewayMock = this.setupChatGatewayMock(chatCounter)

                const validationGatewayMock = this.setupValidationGatewayMock(chatCounter)

                const chatFlowGatewayMock = {
                    getChatFlowById: jest.fn().mockImplementation(async () => {               
                        const nextState = this.setupNextStateByCounter(
                            chatCounter, paricipator1OptionsForEachState, paricipator2OptionsForEachState)
                        
                        return {
                            tryGetNextState: jest.fn().mockResolvedValue({
                                ...this.nextStateResultStub,
                                nextState: nextState
                            })
                        }
                    })
                }

                const expectedResultModelForEachState = (chatCounter: number) => {
                    return this.setupResultModel(chatCounter, expectedP1ResponseOptionsForEachState[chatCounter])
                }

                it('should call according to sequence of validation results', async () => {
                    const usecase = this.setupUsecase(chatFlowGatewayMock, validationGatewayMock, chatGatewayMock);

                    for (chatCounter = 0; chatCounter < 3; chatCounter++) {
                        await usecase.executeProceedInChat(this.setupRequestModel(chatCounter, 'userId1', `content${chatCounter}`));
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState(chatCounter)));

                        await usecase.executeProceedInChat(this.setupRequestModel(chatCounter, 'userId1', `content${chatCounter}`));
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState(chatCounter)));
                    }
                });

                it('should call with the next chat state ids that fit each participator flow', async () => {
                    const usecase = this.setupUsecase(chatFlowGatewayMock, validationGatewayMock, chatGatewayMock);
                    
                    for (chatCounter = 0; chatCounter < 2; chatCounter++) {
                        await usecase.executeProceedInChat(this.setupRequestModel(chatCounter, 'userId1', `content${chatCounter}`));
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState(chatCounter)));

                        await usecase.executeProceedInChat(this.setupRequestModel(chatCounter, 'userId2', `content${chatCounter}`));
                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState(chatCounter)));
                    }
                });
            });
        });

        describe.skip('ChatFlow Scenario for multiple participator states', () => {
            describe('Given stub ChatFlow, no states and events defined', () => {
                const content = 'content0';
                const nextStateId = 'end'
                const { usecase, usecaseOutBoundarySpy, requestModel } = this.arrangeChatFlowWithSingleRequestScenario(content, nextStateId);
                describe('Given a request model with a single chat response (media and content)', () => {
                    describe('When response is sent to the chatFlow', () => {
                        it('should call sendResult with end state', async () => {
                            await this.actChatFlowScenario(usecase, requestModel);
                            this.assertChatFlowScenario(usecaseOutBoundarySpy, true);
                        });
                    });
                });
            });
            describe('Given a ChatFlow (list of participatorFlows), states and events defined', () => {
                const content = 'invalid';
                const nextStateId = 'invalid';
                const { usecase, usecaseOutBoundarySpy, requestModel } = this.arrangeChatFlowWithSingleRequestScenario(content, nextStateId);
                describe('Given a list of request models with chat responses (media and content)', () => {
                    describe('When responses are sent to the chatFlow', () => {
                        it('should call sendResult without end state', async () => {
                            await this.actChatFlowScenario(usecase, requestModel);
                            this.assertChatFlowScenario(usecaseOutBoundarySpy, false);
                        });
                    });
                });
            });
            describe('Given a ChatFlow with 2 states and events defined', () => {
                const nextStateId = 'state1'
                const { usecase, usecaseOutBoundarySpy, requestModels } = 
                    this.arrangeChatFlowWithMultipleRequestsScenario(
                        0, ["content0", "content1"], [nextStateId, "end"], ["event-to-state1", "end"]);
                describe('Given 2 request models with chat responses (media and content)', () => {
                    const requestModels = [
                        this.setupRequestModel(0, 'userId1', 'content0'),
                        this.setupRequestModel(1, 'userId1', 'end')
                    ]
                    
                    describe('When responses are sent to the chatFlow', () => {
                        it('should call sendResult with next state and then with end state', async () => {
                            await this.actChatFlowScenario(usecase, requestModels[0]);
                            this.assertChatFlowScenario(usecaseOutBoundarySpy, false);

                            await this.actChatFlowScenario(usecase, requestModels[1]);
                            this.assertChatFlowScenario(usecaseOutBoundarySpy, true);
                        });
                    });
                });
            });
        });
    }

    private setupRequestModel = (chatCounter: number, userId: string, content: string) => {
        return {
            chatId: this.chatIdStub,
            userId: userId,
            stateInput: {
                stateId: `state${chatCounter}`,
                response: {
                    responseMedia: 'text',
                    responseContent: content
                }
            }
        }
    }

    private setupRequestModelsWithContent(chatCounter: number, participator1UserId: string) {
        return [
            this.setupRequestModel(chatCounter, participator1UserId, 'content0'),
            this.setupRequestModel(chatCounter, participator1UserId, 'content1'),
            this.setupRequestModel(chatCounter, participator1UserId, 'content2')
        ];
    }

    private setupValidationResultsForEachState() {
        const eventValidationResultToState1Stub = {
            success: true,
            error: '',
            event: 'event-to-state0'
        };

        const eventValidationResultToState2Stub = {
            success: true,
            error: '',
            event: 'event-to-state1'
        };

        const eventValidationResultsForEachState = [
            eventValidationResultToState1Stub,
            eventValidationResultToState2Stub,
        ];
        return eventValidationResultsForEachState;
    }

    private setupResponseOptionsResultsForEachState(
        expectedResponseOptionsFull: ParticipatorResponseOptionsResults, 
        responseOptionEmptyInResultModel: ParticipatorResponseOptionsResults
    ) {
        return [
            expectedResponseOptionsFull,
            responseOptionEmptyInResultModel,
            responseOptionEmptyInResultModel
        ];
    }

    private setupNextState(chatCounter: number, paricipator1OptionsForEachState: ({ options: null; } | { options: { responseMedia: { media: string; }; responseRestrictions: { validatorId: string; }; }[]; })[]) {
        return this.setupNextStateByCounter(
            chatCounter, paricipator1OptionsForEachState, paricipator1OptionsForEachState,
            ["event", "event", "event"]
        );
    }

    private setupParticipator1OptionsForEachState(participator1OptionsFull: { options: null; } | { options: { responseMedia: { media: string; }; responseRestrictions: { validatorId: string; }; }[]; }, participatorOptionsEmpty: { options: null; } | { options: { responseMedia: { media: string; }; responseRestrictions: { validatorId: string; }; }[]; }) {
        return [
            participator1OptionsFull,
            participatorOptionsEmpty,
            participatorOptionsEmpty
        ];
    }

    private setupExpectedResultModel(
        responseOptions: { options: { responseMedia: string; responseRestrictions: string; }[]; } = { options: [] }
    ) {
        return {
            chatNextStateId: 'nextState',
            responseOptionsForParticipant: {
                ...responseOptions
            }
        };
    }

    private setupUsecase(
        chatFlowGatewayEmptyOptionsStub: { getChatFlowById: any; }, 
        validationGatewayMock: { validateResponse: any; } = this.validationGatewayStub,
        chatGatewayMock: { getChatById: any; } = this.chatGatewayStub
    ) {
        return ProceedInChatUseCase.fromJson({
            ...this.usecaseStub,
            chatFlowGateway: chatFlowGatewayEmptyOptionsStub,
            validationGateway: validationGatewayMock,
            chatGatewayToProceedInChat: chatGatewayMock
        });
    }

    private setupChatFlowGatewayWithOptions(
        responseOptionsP1: { options: null; } | { options: { responseMedia: { media: string }; responseRestrictions: { validatorId: string }; }[] },
        responseOptionsP2: { options: null; } | { options: { responseMedia: { media: string }; responseRestrictions: { validatorId: string }; }[] } = { options: null }
    ) {
        return {
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
        };
    }

    private setupValidationGatewayMock(chatCounter: number) {
        return {
            validateResponse: jest.fn().mockImplementation((response: {
                responseMedia: string;
                responseContent: string;
            }) => {
                return {
                    ...this.eventValidationResultStub,
                    event: `event-to-state${chatCounter}`
                };
            })
        };
    }

    private setupChatGatewayMock(chatCounter: number) {
        return {
            getChatById: jest.fn().mockImplementation(() => {
                return {
                    ...this.chatGatewayResultModelStub,
                    chat: {
                        ...this.chatStub,
                        currentState: {
                            ...this.currentStateStub,
                            participator1State: `state${chatCounter}`,
                            participator2State: `state${chatCounter}`,
                        }
                    }
                };
            })
        };
    }

    private setupResponseOptions(media: string = 'text', validatorId: string = 'ValidatorId', isNull: boolean = false) {
        if (isNull) {
            return {
                options: null
            }
        }
        return {
            options: [{
                responseMedia: {
                    media: media
                },
                responseRestrictions: {
                    validatorId: validatorId,
                }
            }]
        };
    }

    private setupNextStateByCounter(
        counter: number,
        paricipator1OptionsForEachState: ParticipatorResponseOptions[],
        paricipator2OptionsForEachState: ParticipatorResponseOptions[],
        proceedEvents: string[] = ["event-to-state0", "event-to-state1", "event-to-state2"]
    ) {
        return {
            ...this.nextStateStub,
            id: `state${counter}`,
            participator1Options: paricipator1OptionsForEachState[counter],
            participator2Options: paricipator2OptionsForEachState[counter],
            proceedEvent: proceedEvents[counter]
        }
    }

    private setupResponseOptionsResults(media: string = 'text', validatorId: string = 'ValidatorId', isEmpty: boolean = false) {
        if (isEmpty) {
            return {
                options: []
            }
        }
        return {
            options: [{
                responseMedia: media,
                responseRestrictions: validatorId
            }]
        }
    }

    private setupResultModel(counter: number, expectedResponseOptions: any) {
        return {
            chatNextStateId: `state${counter}`,
            responseOptionsForParticipant: expectedResponseOptions
        }
    }

    private assertChatFlowScenario(usecaseOutBoundarySpy: { sendResultModel: any; }, isEndState: boolean) {
        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
            isEndState: isEndState,
        }));
    }

    private async actChatFlowScenario(usecase: ProceedInChatUseCase, requestModel: ProceedInChatRequestModel) {
        await usecase.executeProceedInChat(requestModel);
    }

    private arrangeChatFlowWithMultipleRequestsScenario(index: number, contents: string[], ids: string[], proceedEvents: string[]) {
        const chatGatewayMock = this.chatGatewayStub;
        const chatFlowGatewayMock = {
            ...this.chatFlowGatewayStub,
            getChatFlowById: jest.fn().mockResolvedValue({
                tryGetNextState: jest.fn().mockImplementation(() => {
                    return {
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            id: ids[index],
                            proceedEvent: proceedEvents[index]
                        }
                    }
                })
            })
        };
        const validationGatewayMock = this.validationGatewayStub;
        const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;

        const usecase = ProceedInChatUseCase.fromJson({
            usecaseOutBoundary: usecaseOutBoundarySpy,
            chatGatewayToProceedInChat: chatGatewayMock,
            chatFlowGateway: chatFlowGatewayMock,
            validationGateway: validationGatewayMock
        });

        const nextStateId = ids[index];

        const requestModels = [{
            chatId: 'chatId',
            userId: 'userId1',
            stateInput: {
                stateId: nextStateId,
                response: {
                    responseMedia: 'text',
                    responseContent: contents[index]
                }
            }
        },
        {
            chatId: 'chatId',
            userId: 'userId1',
            stateInput: {
                stateId: nextStateId,
                response: {
                    responseMedia: 'text',
                    responseContent: contents[index]
                }
            }
        }]

        return { usecase, usecaseOutBoundarySpy, requestModels };
    }

    private arrangeChatFlowWithSingleRequestScenario(content: string, id: string = 'state0', proceedEvent: string = 'end') {
        const chatGatewayMock = this.chatGatewayStub;
        const chatFlowGatewayMock = {
            ...this.chatFlowGatewayStub,
            getChatFlowById: jest.fn().mockResolvedValue({
                tryGetNextState: jest.fn().mockResolvedValue({
                    ...this.nextStateResultStub,
                    nextState: {
                        ...this.nextStateStub,
                        id: id,
                        proceedEvent: proceedEvent
                    }
                })
            })
        };
        const validationGatewayMock = this.validationGatewayStub;
        const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;

        const usecase = ProceedInChatUseCase.fromJson({
            usecaseOutBoundary: usecaseOutBoundarySpy,
            chatGatewayToProceedInChat: chatGatewayMock,
            chatFlowGateway: chatFlowGatewayMock,
            validationGateway: validationGatewayMock
        });

        const requestModel = {
            chatId: 'chatId',
            userId: 'userId1',
            stateInput: {
                stateId: 'state0',
                response: {
                    responseMedia: 'text',
                    responseContent: content
                }
            }
        }

        return { usecase, usecaseOutBoundarySpy, requestModel };
    }

    private expectOptionsForState(
        chatNextStateId: string, 
        expectedResponseOptions1: { options: { responseMedia: string; responseRestrictions: string; }[]; },
        usecaseOutBoundary: any
    ) {
        expect(usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
            chatNextStateId: chatNextStateId,
            responseOptionsForParticipant: expectedResponseOptions1
        }));
    }
}

const proceedInChatUseCaseIntegrationTest = new ProceedInChatUseCaseIntegrationTest();
proceedInChatUseCaseIntegrationTest.runTests();