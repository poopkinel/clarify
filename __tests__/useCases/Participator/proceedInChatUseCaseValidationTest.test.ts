import ProceedInChatRequestModel from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';
import ResponseValidationGateway from '../../../src/boundaries/gateways/responseValidation/responseValidationGateway';
import ProceedInChatUseCaseTestBase from './proceedInChatUseCaseTestBase';

class ProceedInChatValidationUseCaseTest extends ProceedInChatUseCaseTestBase{
    runTests() {
        describe('Given a spy usecaseOutBoundary, a stub participant 1 User ID and a stub request model', () => {           
            const inputResponseStub = {
                responseMedia: 'text',
                responseContent: 'responseContent',
                eventValidationResult: this.eventValidationResultStub
            }

            const dummyStateInput = {
                stateId: 'stateId',
                response: inputResponseStub
            };

            const stubRequestModel = {
                ...this.requestModelStub,
                stateInput: dummyStateInput
            }

            const chatGatewayFailedResult = {
                ...this.chatGatewayResultModelStub,
                success: false,
            };

            const setupStateInputStubWithEvent = (event: string) => ({
                ...dummyStateInput,
                response: {
                    ...inputResponseStub,
                    eventValidationResult: {
                        ...this.eventValidationResultStub,
                        event: event
                    }
                }
            });
            
            describe('Given a stub chat gateway with an invalid chat', () => {
                const invalidchatIdError = 'Invalid chat id';
                const chatGatewayStubWithInvalidChatError = {
                    getChatById: jest.fn().mockResolvedValue({
                        ...chatGatewayFailedResult,
                        error: invalidchatIdError
                    })
                }
                describe('Given a stub request model with empty chat id', () => {
                    const stubEmptyChatId = '';
                    const stubRequestModelWithEmptyChatId = ProceedInChatRequestModel.fromJson({
                        ...stubRequestModel,
                        chatId: stubEmptyChatId
                    });
        
                    expectError(this.usecaseOutBoundarySpy, chatGatewayStubWithInvalidChatError, this.chatFlowGatewayStub_OLD, 
                        stubRequestModelWithEmptyChatId, this.validationGatewayStub, invalidchatIdError);
                });
            });
            
            describe('Given participator 2 ID, stub state input, stub chat entity and stub gateway result', () => {
                const stubStateInputEvent = 'event';
                const stubStateInput = setupStateInputStubWithEvent(stubStateInputEvent);
            
                describe('Given a stub empty success gateway', () => {
                    const chatGatewayStub = {
                        getChatById: jest.fn().mockResolvedValue(this.chatGatewayResultModelStub)
                    }
                    describe('Given a stub request model with empty user id', () => {
                        const stubUserId = '';
                        const stubRequestModelWithOnlyEmptyUserId = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            userId: stubUserId
                        });
                        expectError(this.usecaseOutBoundarySpy, chatGatewayStub, this.chatFlowGatewayStub_OLD,
                            stubRequestModelWithOnlyEmptyUserId, this.validationGatewayStub, 'User is not a participator in this chat');
                    });
                });

                describe('Given a stub chat gateway with valid chat and user', () => {
                    describe('Given a stub request model with invalid event', () => {
                        const stubStateInputWithOnlyEmptyEvent = {
                            ...stubStateInput,
                        }
                        const stubRequestModelWithEmptyInput = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            stateInput: stubStateInputWithOnlyEmptyEvent
                        });

                        const validationGatewayStubWithEmptyEvent = {
                            validateResponse: jest.fn().mockResolvedValue({
                                ...this.eventValidationResultStub,
                                event: ''
                            })
                        }

                        expectError(this.usecaseOutBoundarySpy, this.chatGatewayStub, 
                            this.chatFlowGatewayStub_OLD, stubRequestModelWithEmptyInput, validationGatewayStubWithEmptyEvent,
                            'Invalid chat state event');
                    });
                });

                describe('Given a stub chat gateway with valid chat gateway result', () => {
                    const chatGatewayStubWithValidChatAndUser = {
                        getChatById: jest.fn().mockResolvedValue(this.chatGatewayResultModelStub)
                    }
                    describe('Given a stub chat flow gateway with a next state', () => {
                        const chatFlowGatewayStubWithNextState = this.chatFlowGatewayStub_OLD;

                        describe('When a request model with a different event is sent to the use case', () => {
                            const validationGatewayStubWithDifferentEvent: ResponseValidationGateway = {
                                validateResponse: jest.fn().mockResolvedValue({
                                    ...this.eventValidationResultStub,
                                    event: 'differentEvent'
                                })
                            }

                            expectError(this.usecaseOutBoundarySpy, chatGatewayStubWithValidChatAndUser, chatFlowGatewayStubWithNextState,
                                stubRequestModel, validationGatewayStubWithDifferentEvent, 'Invalid chat state event');
                        });
                    });
                });
            
                describe('Given a stub chat gateway with a valid chat and a valid state', () => {
                    const chatGatewaySuccessStub = {
                        getChatById: jest.fn().mockResolvedValue(this.chatGatewayResultModelStub)
                    }
                    it('should return a success result', async () => {
                        const stubRequestModelWithAllValidData = ProceedInChatRequestModel.fromJson({
                            ...stubRequestModel,
                            stateInput: stubStateInput
                        });
                        await expectNoErrors(this.usecaseOutBoundarySpy, chatGatewaySuccessStub,
                            this.chatFlowGatewayStub_OLD, this.validationGatewayStub, stubRequestModelWithAllValidData);
                    });
                });
            });
            
            async function expectNoErrors(
                usecaseOutBoundarySpy: { sendResultModel: any; }, 
                chatGatewayStub: { getChatById: any; }, 
                chatFlowGatewayStub: { getChatFlowById: any; },
                validationGatewayStub: ResponseValidationGateway,
                requestModel: ProceedInChatRequestModel
            ) {
                const dummyUseCase = ProceedInChatUseCase.fromJson({
                    usecaseOutBoundary: usecaseOutBoundarySpy, 
                    chatGatewayToProceedInChat: chatGatewayStub, 
                    chatFlowGateway: chatFlowGatewayStub,
                    validationGateway: validationGatewayStub
                });
                await dummyUseCase.executeProceedInChat(requestModel);
                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                    errors: []
                }));
            }
            
            function expectError(
                usecaseOutBoundarySpy: { sendResultModel: any; }, 
                chatGatewayStub: { getChatById: any; }, 
                chatFlowGatewayStub: { getChatFlowById: any; },
                requestModel: ProceedInChatRequestModel,
                validationGatewayStub: ResponseValidationGateway,
                expectedError: string
            ) {
                it(`should return an ${expectedError} result`, async () => {
                    const usecase = ProceedInChatUseCase.fromJson({
                        usecaseOutBoundary: usecaseOutBoundarySpy, 
                        chatGatewayToProceedInChat: chatGatewayStub, 
                        chatFlowGateway: chatFlowGatewayStub,
                        validationGateway: validationGatewayStub
                    })
                    await usecase.executeProceedInChat(requestModel);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        errors: expect.arrayContaining([expectedError])
                    }));
                });
            }
        });
    }
}

const validationTest = new ProceedInChatValidationUseCaseTest();
validationTest.runTests();