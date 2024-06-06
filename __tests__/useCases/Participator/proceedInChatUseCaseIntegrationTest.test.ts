import exp from 'constants';
import UsecaseOutBoundary from '../../../src/boundaries/useCaseBoundaries/usecaseOutBoundary';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';
import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';

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

        const responseOptionEmptyStub = {
            options: null
        }

        const responseOptionEmptyInResultModel = {
            options: []
        }

        describe('Given a request model stub and empty response options stub', () => {

            const chatFlowGatewayEmptyOptionsStub = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            participator1Options: responseOptionEmptyStub,
                            participator2Options: responseOptionEmptyStub
                        }
                    })
                })
            }

            describe('When usecase is called with request model', () => {
                
                it('usecaseOutBoundary should be called with a result model with next state and response options', async () => {
                    const usecase = ProceedInChatUseCase.fromJson({
                        ...this.usecaseStub,
                        chatFlowGateway: chatFlowGatewayEmptyOptionsStub
                    });
                    await usecase.executeProceedInChat(requestModelStub);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatNextStateId: 'nextState',
                        responseOptionsForParticipant: {
                            options: []
                        }
                    }));
                });
            });
        });

        describe('Given a request model stub and non-empty response options stub', () => {
            const responseOptionsP1OnlyStub = {
                ...responseOptionEmptyStub,
                options: [{
                    responseMedia: {
                        media: 'text'
                    },
                    responseRestrictions: {
                        validatorId: 'CantBeQuestionValidatorId',
                    }
                }]
            }

            const chatFlowGatewayStub = {
                getChatFlowById: jest.fn().mockResolvedValue({
                    tryGetNextState: jest.fn().mockResolvedValue({
                        ...this.nextStateResultStub,
                        nextState: {
                            ...this.nextStateStub,
                            participator1Options: responseOptionsP1OnlyStub,
                            participator2Options: responseOptionEmptyStub
                        }
                    })
                })
            }

            describe('When usecase is called with request model', () => {
                
                it('usecaseOutBoundary should be called with a result model with next state and response options', async () => {
                    const usecase = ProceedInChatUseCase.fromJson({
                        ...this.usecaseStub,
                        chatFlowGateway: chatFlowGatewayStub
                    });
                    const requestModel = requestModelStub;
                    await usecase.executeProceedInChat(requestModel);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatNextStateId: 'nextState',
                        responseOptionsForParticipant: {
                            options: [{
                                responseMedia: 'text',
                                responseRestrictions: 'CantBeQuestionValidatorId'
                            }]
                        }
                    }));
                });
            });
        });

        
        describe('Given a mock chatFlowGateway with stub request models and response options', () => {
            var chatCounter: number;
            const chatFlowGatewayMock = {
                getChatFlowById: jest.fn().mockImplementation(async () => {
                    const participator1OptionsFull = {
                        options: [{
                            responseMedia: {
                                media: 'text'
                            },
                            responseRestrictions: {
                                validatorId: 'CantBeQuestionValidatorId',
                            }
                        }]
                    };
    
                    const participator1OptionsEmpty = {
                        options: null
                    };
    
                    const paricipator1OptionsForEachState = [
                        participator1OptionsFull,
                        participator1OptionsEmpty,
                        participator1OptionsEmpty
                    ];
    
                    const nextState = {
                        ...this.nextStateStub,
                        id: `state${chatCounter}`,
                        participator1Options: paricipator1OptionsForEachState[chatCounter],
                    }
                    
                    return {
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...this.nextStateResultStub,
                            nextState: nextState
                        })
                    }
                })
            }
            describe('Given an expected result model', () => {
                describe('When usecase is called with request model', () => {
                    const requestModel = requestModelStub;
                    const expectedResponseOptionsFull = {
                        options: [{
                            responseMedia: 'text',
                            responseRestrictions: 'CantBeQuestionValidatorId'
                        }]
                    }

                    it('usecaseOutBoundary should be called with a result model with next state and response options according to sequence', async () => {
                        const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...this.usecaseStub,
                            chatFlowGateway: chatFlowGatewayMock,
                            usecaseOutBoundary: usecaseOutBoundarySpy
                        });

                        const expectedResponseOptionsForEachState = [
                            expectedResponseOptionsFull,
                            responseOptionEmptyInResultModel,
                            responseOptionEmptyInResultModel
                        ]

                        chatCounter = 0;
                        for (let i = 0; i < expectedResponseOptionsForEachState.length; i++) {
                            await usecase.executeProceedInChat(requestModel);
                            chatCounter++;
                            this.expectOptionsForState(`state${i}`, expectedResponseOptionsForEachState[i], usecaseOutBoundarySpy);
                        }
                    });
                });
            });
        });
        describe('Given a mock chatFlowGateway for both participators', () => {
            var chatCounter: number;
            const chatFlowGatewayMock = {
                getChatFlowById: jest.fn().mockImplementation(async () => {
                    const participatorOptionsFull = {
                        options: [{
                            responseMedia: {
                                media: 'text'
                            },
                            responseRestrictions: {
                                validatorId: 'ValidatorId',
                            }
                        }]
                    };
    
                    const participatorOptionsEmpty = {
                        options: null
                    };
    
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
    
                    const nextState = {
                        ...this.nextStateStub,
                        id: `state${chatCounter}`,
                        participator1Options: paricipator1OptionsForEachState[chatCounter],
                        participator2Options: paricipator2OptionsForEachState[chatCounter]
                    }
                    
                    return {
                        tryGetNextState: jest.fn().mockResolvedValue({
                            ...this.nextStateResultStub,
                            nextState: nextState
                        })
                    }
                })
            }
            describe('Given an expected result model', () => {
                const responseOptionsFullInResultModel = {
                    options: [{
                        responseMedia: 'text',
                        responseRestrictions: 'ValidatorId'
                    }]
                }

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

                describe('When usecase is called with the correct request models sequence alternating between the participators', () => {
                    const participator1UserId = this.userIdStub;
                    const participator2UserId = this.stubParticipator2UserId;

                    const requestModelWithFullResponseOptionsStub = (userId: string, content: string) => {
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
                    const requestModelsP1WithContentStubs = [
                        requestModelWithFullResponseOptionsStub(participator1UserId, 'content0'),
                        requestModelWithFullResponseOptionsStub(participator1UserId, 'content1'),
                        requestModelWithFullResponseOptionsStub(participator1UserId, 'content2')
                    ]

                    const requestModelsP2WithContentStubs = [
                        requestModelWithFullResponseOptionsStub(participator2UserId, 'content0'),
                        requestModelWithFullResponseOptionsStub(participator2UserId, 'content1'),
                        requestModelWithFullResponseOptionsStub(participator2UserId, 'content2')
                    ]

                    it('usecaseOutBoundary should be called with a result model with next state and response options according to sequence', async () => {
                        const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;
                        const usecase = ProceedInChatUseCase.fromJson({
                            ...this.usecaseStub,
                            chatFlowGateway: chatFlowGatewayMock,
                            usecaseOutBoundary: usecaseOutBoundarySpy
                        });


                        for (chatCounter = 0; chatCounter < expectedP1ResponseOptionsForEachState.length; chatCounter++) {
                            await usecase.executeProceedInChat(requestModelsP1WithContentStubs[chatCounter]);
                            this.expectOptionsForState(`state${chatCounter}`, expectedP1ResponseOptionsForEachState[chatCounter], usecaseOutBoundarySpy);

                            await usecase.executeProceedInChat(requestModelsP2WithContentStubs[chatCounter]);
                            this.expectOptionsForState(`state${chatCounter}`, expectedP2ResponseOptionsForEachState[chatCounter], usecaseOutBoundarySpy);
                        }
                    });
                });

                describe('Given a validation gateway with an event validation result', () => {
                    const eventValidationResultToState1Stub = {
                        success: true,
                        error: '',
                        event: 'event-to-state0'
                    }

                    const eventValidationResultToState2Stub = {
                        success: true,
                        error: '',
                        event: 'event-to-state1'
                    }

                    const eventValidationResultsForEachState = [
                        eventValidationResultToState1Stub,
                        eventValidationResultToState2Stub,
                    ]

                    const validationGatewayEventsSequenceStub = {
                        validateResponse: jest.fn().mockImplementation((response: {
                            responseMedia: string;
                            responseContent: string;
                        }) => {
                            const eventValidationResultIndex = response.responseContent[response.responseContent.length - 1]
                            return eventValidationResultsForEachState[Number(eventValidationResultIndex)];
                        })
                    }

                    const chatGatewayMock = this.chatGatewayStub;

                    const chatFlowGatewayMock = {
                        getChatFlowById: jest.fn().mockImplementation(async () => {
                            const participatorOptionsFull = {
                                options: [{
                                    responseMedia: {
                                        media: 'text'
                                    },
                                    responseRestrictions: {
                                        validatorId: 'ValidatorId',
                                    }
                                }]
                            };
            
                            const participatorOptionsEmpty = {
                                options: null
                            };
            
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
            
                            const nextState = {
                                ...this.nextStateStub,
                                id: `state${chatCounter}`,
                                participator1Options: paricipator1OptionsForEachState[chatCounter],
                                participator2Options: paricipator2OptionsForEachState[chatCounter],
                                proceedEvent: `event-to-state${chatCounter}`
                            }
                            
                            return {
                                tryGetNextState: jest.fn().mockResolvedValue({
                                    ...this.nextStateResultStub,
                                    nextState: nextState
                                })
                            }
                        })
                    }

                    describe('Given the request models and expected result models for each state', () => {
                        const responseOptionsFullInResultModel = {
                            options: [{
                                responseMedia: 'text',
                                responseRestrictions: 'ValidatorId'
                            }]
                        }
        
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

                        const participator1UserId = this.userIdStub;
                        const requestModelWithFullResponseOptionsStub = (userId: string, content: string) => {
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
                        const requestModelsP1WithContentStubs = [
                            requestModelWithFullResponseOptionsStub(participator1UserId, 'content0'),
                            requestModelWithFullResponseOptionsStub(participator1UserId, 'content1'),
                            requestModelWithFullResponseOptionsStub(participator1UserId, 'content2')
                        ]

                        it('should call the out boundary with the result models according to sequence of validation results', async () => {
                            const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;
                            const usecase = ProceedInChatUseCase.fromJson({
                                ...this.usecaseStub,
                                chatGatewayToProceedInChat: chatGatewayMock,
                                chatFlowGateway: chatFlowGatewayMock,
                                usecaseOutBoundary: usecaseOutBoundarySpy,
                                validationGateway: validationGatewayEventsSequenceStub
                            });
                            chatCounter = 0;
                            await usecase.executeProceedInChat(requestModelsP1WithContentStubs[0]);

                            expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                chatNextStateId: 'state0',
                                responseOptionsForParticipant: expectedP1ResponseOptionsForEachState[0]
                            }));

                            chatCounter++;
                            await usecase.executeProceedInChat(requestModelsP1WithContentStubs[1]);
                            expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                chatNextStateId: 'state1',
                                responseOptionsForParticipant: expectedP1ResponseOptionsForEachState[1]
                            }));
                        });
                    });
                });
            });
        });
        describe('Full chat flow with 3 states and 2 participators', () => {
            var chatCounter: number;
            describe('Given a mock chat gateway with updating current state for chat', () => {
                const chatGatewayMock = {
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
                        }
                    })
                }

                const validationGatewayMock = {
                    validateResponse: jest.fn().mockImplementation((response: {
                        responseMedia: string;
                        responseContent: string;
                    }) => {
                        return {
                            success: true,
                            error: '',
                            event: `event-to-state${chatCounter}`
                        }
                    })
                }

                const chatFlowGatewayMock = {
                    getChatFlowById: jest.fn().mockImplementation(async () => {
                        const participatorOptionsFull = {
                            options: [{
                                responseMedia: {
                                    media: 'text'
                                },
                                responseRestrictions: {
                                    validatorId: 'ValidatorId',
                                }
                            }]
                        };
        
                        const participatorOptionsEmpty = {
                            options: null
                        };
        
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
        
                        const nextState = {
                            ...this.nextStateStub,
                            id: `state${chatCounter}`,
                            participator1Options: paricipator1OptionsForEachState[chatCounter],
                            participator2Options: paricipator2OptionsForEachState[chatCounter],
                            proceedEvent: `event-to-state${chatCounter+1}`
                        }
                        
                        return {
                            tryGetNextState: jest.fn().mockResolvedValue({
                                ...this.nextStateResultStub,
                                nextState: nextState
                            })
                        }
                    })
                }

                const expectedResultModelForEachState = [
                    {
                        chatNextStateId: 'state0',
                        responseOptionsForParticipant: {
                            options: [{
                                responseMedia: 'text',
                                responseRestrictions: 'ValidatorId'
                            }]
                        }
                    },
                    {
                        chatNextStateId: 'state1',
                        responseOptionsForParticipant: {
                            options: []
                        }
                    },
                    {
                        chatNextStateId: 'state2',
                        responseOptionsForParticipant: {
                            options: []
                        }
                    }
                ]

                const requestModelsP1WithContentStubs = [
                    {
                        ...this.requestModelStub,
                        userId: 'userId1',
                        stateInput: {
                            stateId: `state${chatCounter}`,
                            response: {
                                responseMedia: 'text',
                                responseContent: 'content0'
                            }
                        }
                    },
                    {
                        ...this.requestModelStub,
                        userId: 'userId1',
                        stateInput: {
                            stateId: `state${chatCounter}`,
                            response: {
                                responseMedia: 'text',
                                responseContent: 'content1'
                            }
                        }
                    },
                    {
                        ...this.requestModelStub,
                        userId: 'userId1',
                        stateInput: {
                            stateId: `state${chatCounter}`,
                            response: {
                                responseMedia: 'text',
                                responseContent: 'content2'
                            }
                        }
                    }
                ]

                const requestModelsP2WithContentStubs = [
                    {
                        ...this.requestModelStub,
                        userId: 'userId2',
                        stateInput: {
                            stateId: `state${chatCounter}`,
                            response: {
                                responseMedia: 'text',
                                responseContent: 'content0'
                            }
                        }
                    },
                    {
                        ...this.requestModelStub,
                        userId: 'userId2',
                        stateInput: {
                            stateId: `state${chatCounter}`,
                            response: {
                                responseMedia: 'text',
                                responseContent: 'content1'
                            }
                        }
                    },
                    {
                        ...this.requestModelStub,
                        userId: 'userId2',
                        stateInput: {
                            stateId: `state${chatCounter}`,
                            response: {
                                responseMedia: 'text',
                                responseContent: 'content2'
                            }
                        }
                    }
                ]

                it('should call the out boundary with the result models according to sequence of validation results', async () => {
                    const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;
                    const usecase = ProceedInChatUseCase.fromJson({
                        ...this.usecaseStub,
                        chatGatewayToProceedInChat: chatGatewayMock,
                        chatFlowGateway: chatFlowGatewayMock,
                        validationGateway: validationGatewayMock,
                        usecaseOutBoundary: usecaseOutBoundarySpy
                    });

                    for (chatCounter = 0; chatCounter < expectedResultModelForEachState.length; chatCounter++) {
                        await usecase.executeProceedInChat(requestModelsP1WithContentStubs[chatCounter]);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState[chatCounter]));

                        await usecase.executeProceedInChat(requestModelsP2WithContentStubs[chatCounter]);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState[chatCounter]));
                    }
                });

                it('should call the out boundary with the next chat state ids that fit each participator flow', async () => {
                    const usecaseOutBoundarySpy = this.usecaseOutBoundarySpy;
                    const usecase = ProceedInChatUseCase.fromJson({
                        ...this.usecaseStub,
                        chatGatewayToProceedInChat: chatGatewayMock,
                        chatFlowGateway: chatFlowGatewayMock,
                        validationGateway: validationGatewayMock,
                        usecaseOutBoundary: usecaseOutBoundarySpy
                    });

                    chatCounter = 0;
                    await usecase.executeProceedInChat(requestModelsP1WithContentStubs[chatCounter]);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState[chatCounter]));

                    await usecase.executeProceedInChat(requestModelsP2WithContentStubs[chatCounter]);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState[chatCounter]));

                    chatCounter++;
                    await usecase.executeProceedInChat(requestModelsP1WithContentStubs[chatCounter]);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState[chatCounter]));

                    await usecase.executeProceedInChat(requestModelsP2WithContentStubs[chatCounter]);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining(expectedResultModelForEachState[chatCounter]));
                });
            });
        });
        describe('Given ChatFlow (list of participatorFlows), states and events defined', () => {
            describe('Given a list of request models with chat responses (media and content)', () => {
                describe('When responses are sent to the chatFlow', () => {
                    it('should call sendResult for each valid response, and end with finish state or error state', async () => {
                        expect(true).toBe(true);
                    });
                });
            });
        });
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