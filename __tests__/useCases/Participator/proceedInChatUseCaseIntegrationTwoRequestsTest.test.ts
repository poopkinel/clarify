import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';
import { ChatResponseOptionsResult, ChatResponseOptionResult } from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatResultModel';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';
import ProceedInChatRequestModel from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel';
import ChatFlowGatewayTwoRequestMock from '../../chatFlowGateway/ChatFlowGatewayMock';

class ProceedInChatUseCaseIntegrationTwoRequestsTest extends ProceedInChatUseCaseBaseTest
{
    setupExpectedResults = {
        errors: [[],[]] as string[][],
        isChatEnded: [false, false],
        responseOptions: [
            { options: [] as ChatResponseOptionResult[] }, { options: [] as ChatResponseOptionResult[] }
        ]
    }
    
    setupExpectedResultsWithDifferentIsChatEndedAndErrors = (
        firstIsEnded: boolean, 
        secondIsEnded: boolean,
        firstErrors: string[],
        secondErrors: string[]
    ) => {
        return {
            ...this.setupExpectedResults,
            isChatEnded: [firstIsEnded, secondIsEnded],
            errors: [firstErrors, secondErrors]
        }
    }
    
    runTests() {
        describe('Test flow for two requests', () => {
            describe('Two dummy requests when chat ended', () => {
                it('should call with error twice', async () => {
                    const setupData = {
                        ...this.setupDataTwoRequests,
                        first: { ...this.setupData, isChatEnded: true }
                    }

                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(setupData);
    
                    const setupExpectedResults = this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(true, true, ['Chat ended'], ['Chat ended'])

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                });
            });
            describe('Two dummy requests when chat not ended', () => {
                it('should call with the dummy result model twice', async () => {
                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests();

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels);
                });
            });

            const twoRequestsSetupDataWithOnlyDifferentIsChatEnded = (firstIsEnded: boolean, secondIsEnded: boolean) => {
                return {
                    ...this.setupDataTwoRequests,
                    first: { ...this.setupData, isChatEnded: firstIsEnded },
                    second: { ...this.setupData, isChatEnded: secondIsEnded }
                }
            }

            describe('Same dummy requests twice, first chat state isEnd is false, second is true', () => {
                it('should call with a dummy result model and then with chat end error', async () => {
                    const twoRequestsSetupData = twoRequestsSetupDataWithOnlyDifferentIsChatEnded(false, true);
                    
                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(false, true, [], ['Chat ended'])

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                })
            })
            describe('Same dummy requests twice, first chat state isEnd true, second is false', () => {
                it('should call with error result model and then with a dummy result', async () => {
                    const twoRequestsSetupData = twoRequestsSetupDataWithOnlyDifferentIsChatEnded(true, false);
                    
                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(true, false, ['Chat ended'], [])

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                })
            });

            const twoRequestsSetupDataWithOnlyDifferentInvalidContent = (firstInvalidContent: boolean, secondInvalidContent: boolean) => {
                return {
                    ...this.setupDataTwoRequests,
                    first: firstInvalidContent ? {
                        ...this.setupData,
                        content: 'invalidContent',
                        validateResultSuccess: false,
                        validateResultError: 'Content invalid for event'
                    } : this.setupData,

                    second: secondInvalidContent ? {
                        ...this.setupData,
                        content: 'invalidContent',
                        validateResultSuccess: false,
                        validateResultError: 'Content invalid for event'
                    } : this.setupData
                }
            }

            describe('One dummy request and one request with invalid content', () => {
                it('should call with the dummy result model and then with an error for the invalid content', async () => {
                    const twoRequestsSetupData = twoRequestsSetupDataWithOnlyDifferentInvalidContent(false, true);

                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = 
                        this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(false, false, [], ['Content invalid for event']);

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                });
            });

            describe('One request with invalid content and dummy request', () => {
                it('should call with the dummy result model and then with an error for the invalid content', async () => {
                    const twoRequestsSetupData = twoRequestsSetupDataWithOnlyDifferentInvalidContent(true, false);

                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = 
                        this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(false, false, ['Content invalid for event'], []);

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                });
            });

            describe('Two requests with invalid content', () => {
                it('should call with an error for the invalid content twice', async () => {
                    const twoRequestsSetupData = twoRequestsSetupDataWithOnlyDifferentInvalidContent(true, false);

                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = 
                        this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(
                            false, false, ['Content invalid for event'], ['Content invalid for event']
                        );

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                });
            });

            describe('Two requests with invalid validated event', () => {
                it('should call with an error for the invalid event twice', async () => {
                    const setupData = {
                        ...this.setupDataTwoRequests,
                        first: { ...this.setupData, validatedEvent: 'invalidEvent' },
                        second: { ...this.setupData, validatedEvent: 'invalidEvent' }
                    }

                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(setupData);

                    const setupExpectedResults = 
                        this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(
                            false, false, ['Invalid chat state event'], ['Invalid chat state event']
                        );

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                });
            });

            describe('One request with end state and second with invalid validated event', () => {
                it('should call with a chat end error and then with error for the invalid event', async () => {
                    const setupData = {
                        ...this.setupDataTwoRequests,
                        first: { ...this.setupData, isChatEnded: true },
                        second: { ...this.setupData, validatedEvent: 'invalidEvent' }
                    }

                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(setupData);

                    const setupExpectedResults = 
                        this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(
                            true, false, ['Chat ended'], ['Invalid chat state event']
                        );

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                })
            });

            describe('One request with invalid validated event and second with end state', () => {
                it('should call with an error for the invalid event and then with a chat end error', async () => {
                    const setupData = {
                        ...this.setupDataTwoRequests,
                        first: { ...this.setupData, validatedEvent: 'invalidEvent' },
                        second: { ...this.setupData, isChatEnded: true },
                    }

                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(setupData);

                    const setupExpectedResults = 
                        this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(
                            false, true, ['Invalid chat state event'], ['Chat ended']
                        );

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                })
            });
            describe('Given a chatFlowGateway with a transition from first state to second state', () => {
                describe('One request with valid content and event, and second with invalid content', () => {
                    it('should call with a dummy result model and then with an error for the invalid content', async () => {
                        const setupData = {
                            ...this.setupDataTwoRequests,
                            first: this.setupData,
                            second: {
                                ...this.setupData,
                                content: 'invalidContent',
                                validateResultSuccess: false,
                                validateResultError: 'Content invalid for event'
                            },
                            common: {
                                chatFlowGateway: new ChatFlowGatewayTwoRequestMock(
                                    this.nextStateResultStub,
                                    this.nextStateStub,
                                    this.setupData,
                                    {
                                        ...this.setupData,
                                        content: 'invalidContent',
                                        validateResultSuccess: false,
                                        validateResultError: 'Content invalid for event'
                                    }
                                )
                            }
                        }

                        const { usecase, requestModels, usecaseOutBoundary } = 
                            this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(setupData);

                        const setupExpectedResults = 
                            this.setupExpectedResultsWithDifferentIsChatEndedAndErrors(
                                false, false, [], ['Content invalid for event']
                            );

                        await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                    })
                });
            });
        }); 
    }

    private async actAssertLoop(
        usecaseOutBoundarySpy: any,
        usecase: ProceedInChatUseCase, 
        requestModels: ProceedInChatRequestModel[], 
        setup = this.setupExpectedResults, 
        times = 2
    ) {
        for (let i = 0; i < times; i++) {
            await usecase.executeProceedInChat(requestModels[i]);
            this.assertCalledWith(setup, i, usecaseOutBoundarySpy);
        }
    }

    private assertCalledWith(setup = this.setupExpectedResults, i = 0, usecaseOutBoundarySpy: any) {
        this.assertCalledWithOnce(setup.errors[i], setup.isChatEnded[i], setup.responseOptions[i], usecaseOutBoundarySpy);
    }

    private assertCalledWithOnce(
        errors: string[] = [],
        isChatEnded: boolean = false,
        responseOptions: ChatResponseOptionsResult = { options: [] }, 
        usecaseOutBoundarySpy: any
    ) {
        if (errors.length === 0) {
            expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                errors: errors,
                isChatEnded: isChatEnded,
                responseOptionsForParticipant: responseOptions
            }));
            return;
        }
        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining(errors),
            isChatEnded: isChatEnded,
            responseOptionsForParticipant: responseOptions
        }));
    }
}

const test = new ProceedInChatUseCaseIntegrationTwoRequestsTest();
test.runTests();