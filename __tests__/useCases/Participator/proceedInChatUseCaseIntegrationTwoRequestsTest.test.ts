import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';
import { ChatResponseOptionsResult, ChatResponseOptionResult } from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatResultModel';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';
import ProceedInChatRequestModel from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel';

class ProceedInChatUseCaseIntegrationTwoRequestsTest extends ProceedInChatUseCaseBaseTest
{
    setupExpectedResults = {
        errors: [[],[]] as string[][],
        isChatEnded: [false, false],
        responseOptions: [
            { options: [] as ChatResponseOptionResult[] }, { options: [] as ChatResponseOptionResult[] }
        ]
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
    
                    const setupExpectedResults = {
                        ...this.setupExpectedResults,
                        errors: [['Chat ended'], ['Chat ended']],
                        isChatEnded: [true, true],
                    }

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

            const setupExpectedResultsWithDifferentIsChatEndedAndErrors = (
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

            describe('Same dummy requests twice, first chat state isEnd is false, second is true', () => {
                it('should call with a dummy result model and then with chat end error', async () => {
                    const twoRequestsSetupData = twoRequestsSetupDataWithOnlyDifferentIsChatEnded(false, true);
                    
                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = setupExpectedResultsWithDifferentIsChatEndedAndErrors(false, true, [], ['Chat ended'])

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                })
            })
            describe('Same dummy requests twice, first chat state isEnd true, second is false', () => {
                it('should call with error result model and then with a dummy result', async () => {
                    const twoRequestsSetupData = twoRequestsSetupDataWithOnlyDifferentIsChatEnded(true, false);
                    
                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = setupExpectedResultsWithDifferentIsChatEndedAndErrors(true, false, ['Chat ended'], [])

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
                        setupExpectedResultsWithDifferentIsChatEndedAndErrors(false, false, [], ['Content invalid for event']);

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                });
            });

            describe('One request with invalid content and dummy request', () => {
                it('should call with the dummy result model and then with an error for the invalid content', async () => {
                    const twoRequestsSetupData = twoRequestsSetupDataWithOnlyDifferentInvalidContent(true, false);

                    const { usecase, requestModels, usecaseOutBoundary } = 
                        this.generateUsecaseRequestModelAndOutboundaryBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = 
                        setupExpectedResultsWithDifferentIsChatEndedAndErrors(false, false, ['Content invalid for event'], []);

                    await this.actAssertLoop(usecaseOutBoundary, usecase, requestModels, setupExpectedResults);
                });
            });

            describe('First request with dummy content and second with invalid content', () => {
                it('should call with the dummy result model and then with an error for the invalid content', async () => {
                    const setupData = {
                        ...this.setupData,
                        content: 'invalidContent',
                        validateResultSuccess: false,
                        validateResultError: 'Content invalid for event'
                    }

                    const expectedIsEndState = true;
                    const expectedEmptyOptionsResult = {
                        options: [] as ChatResponseOptionResult[]
                    }

                    await this.executeUsecaseWithSetupData();
                    // this.assertCalledWith(expectedIsEndState, expectedEmptyOptionsResult);

                    await this.executeUsecaseWithSetupData(setupData);
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        errors: expect.arrayContaining(['Content invalid for event'])
                    }));
                });
            });
            describe('Two requests with invalid content', () => {
                it('should call with an error for the invalid content twice', async () => {
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

                    await this.executeUsecaseWithSetupData(setupData);
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        errors: expect.arrayContaining(['Content invalid for event'])
                    }));
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