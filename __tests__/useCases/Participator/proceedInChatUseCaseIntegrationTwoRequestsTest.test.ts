import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';
import { ChatResponseOptionsResult, ChatResponseOptionResult } from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatResultModel';
import ChatGatewayMock from '../../chatGateway/ChatGatewayMock';

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

                    const { usecase, requestModels } = 
                        this.generateUsecaseAndRequestModelBasedOnSetupDataForTwoRequests(setupData);
    
                    const setupExpectedResults = {
                        ...this.setupExpectedResults,
                        errors: [['Chat ended'], ['Chat ended']],
                        isChatEnded: [true, true],
                    }

                    for (let i = 0; i < 2; i++) {
                        await usecase.executeProceedInChat(requestModels[i]);
                        this.assertCalledWith(setupExpectedResults, i);
                    }
                });
            });
            describe('Two dummy requests when chat not ended', () => {
                it('should call with the dummy result model twice', async () => {
                    const { usecase, requestModels } = 
                        this.generateUsecaseAndRequestModelBasedOnSetupDataForTwoRequests();

                    for (let i = 0; i < 2; i++) {
                        await usecase.executeProceedInChat(requestModels[i]);
                        this.assertCalledWith(this.setupExpectedResults, i);
                    }
                });
            });
            describe('Same dummy requests twice, isChatEnd false before first request true after second', () => {
                it.only('should call with a dummy result model and then with chat end error', async () => {
                    const twoRequestsSetupData = {
                        ...this.setupDataTwoRequests,
                        first: { ...this.setupData, isChatEnded: false },
                        second: { ...this.setupData, isChatEnded: true }
                    }
                    
                    const { usecase, requestModels } = 
                        this.generateUsecaseAndRequestModelBasedOnSetupDataForTwoRequests(twoRequestsSetupData);

                    const setupExpectedResults = {
                        ...this.setupExpectedResults,
                        isChatEnded: [false, true],
                        errors: [[], ['Chat ended']]
                    }

                    for (let i = 0; i < 2; i++) {
                        await usecase.executeProceedInChat(requestModels[i]);
                        this.assertCalledWith(setupExpectedResults, i);
                    }
                })
            })

            describe('One dummy request and one request with invalid content', () => {
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
                    // this.assertCalledWith(expectedIsEndState, expectedEmptyOptionsResult, ['Content invalid for event']);
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

    private assertCalledWith(setup = this.setupExpectedResults, i = 0) {
        this.assertCalledWithOnce(setup.errors[i], setup.isChatEnded[i], setup.responseOptions[i]);
    }

    private assertCalledWithOnce(
        errors: string[] = [],
        isChatEnded: boolean = false,
        responseOptions: ChatResponseOptionsResult = { options: [] }, 
    ) {
        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining(errors),
            isChatEnded: isChatEnded,
            responseOptionsForParticipant: responseOptions
        }));
    }
}

const test = new ProceedInChatUseCaseIntegrationTwoRequestsTest();
test.runTests();