import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';
import { ProceedInChatResultModel, ChatResponseOptionsResult, ChatResponseOptionResult } from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatResultModel';

class ProceedInChatUseCaseIntegrationTwoRequestsTest extends ProceedInChatUseCaseBaseTest
{
    runTests() {
        describe('Test flow for two requests', () => {
            describe('Same dummy requests twice, same state for start and end', () => {
                it.only('should call with the same dummy result model twice', async () => {
                    const expectedIsEndState = true;
                    const expectedEmptyOptionsResult = {
                        options: [] as ChatResponseOptionResult[]
                    }

                    const { usecase, requestModels } = 
                        this.generateUsecaseAndRequestModelBasedOnSetupDataForTwoRequests();


                    for (let i = 0; i < 2; i++) {
                        await usecase.executeProceedInChat(requestModels[i]);
                        this.assertCalledWith(expectedIsEndState, expectedEmptyOptionsResult);
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
                    this.assertCalledWith(expectedIsEndState, expectedEmptyOptionsResult);

                    await this.executeUsecaseWithSetupData(setupData);
                    this.assertCalledWith(expectedIsEndState, expectedEmptyOptionsResult, ['Content invalid for event']);
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
                    this.assertCalledWith(expectedIsEndState, expectedEmptyOptionsResult);

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

    private assertCalledWith(isEndState: boolean, responseOptions: ChatResponseOptionsResult, errors: string[] = []) {
        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
            isEndState: isEndState,
            responseOptionsForParticipant: responseOptions
        }));
    }
}

const test = new ProceedInChatUseCaseIntegrationTwoRequestsTest();
test.runTests();