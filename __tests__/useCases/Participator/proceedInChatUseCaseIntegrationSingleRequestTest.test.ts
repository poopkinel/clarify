import { ChatResponseOptionsResult } from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatResultModel';
import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';

class ProceedInChatUseCaseIntegrationSingleRequestTest extends ProceedInChatUseCaseBaseTest {
    runTests() {
        describe('Test flow for single request', () => {
            describe('Given the chat is not in end state and all values are dummies', () => {
                it('should call with result model value isEnd: dummy and responseOptions: based on dummy nextState ', async () => {
                    await this.executeUsecaseWithSetupData();
                    this.assertCalledWithResultModel([], false, { options: [] });
                });
            });
            describe('Given the chat is already in end state', () => {
                it('should call with error result model: Chat ended', async () => {
                    const setupData = {
                        ...this.setupData,
                        isChatEnded: true
                    }
                    await this.executeUsecaseWithSetupData(setupData);   
                    this.assertCalledWithResultModel(['Chat ended'], true, { options: [] });
                });
            });
            describe('Given invalid content and failed validation result', () => {
                describe('With isChatEnded true', () => {
                    it('should call with error result model: Chat ended', async () => {
                        const setupData = {
                            ...this.setupData,
                            content: 'invalidContent',
                            validateResultSuccess: false,
                            validateResultError: 'Content invalid for event',
                            isChatEnded: true
                        }

                        await this.executeUsecaseWithSetupData(setupData);

                        this.assertCalledWithResultModel(['Chat ended'], true);
                    });
                });
                describe('With isChatEnded false', () => {
                    it('should call with result model containing error for content event', async () => {
                        const setupData = {
                            ...this.setupData,
                            content: 'invalidContent',
                            validateResultSuccess: false,
                            validateResultError: 'Content invalid for event',
                            isChatEnded: false
                        }

                        await this.executeUsecaseWithSetupData(setupData);

                        this.assertCalledWithResultModel(['Content invalid for event']);
                    });
                });
            })
            describe('Given a validated event different from proceed event', () => {
                it('should call with result model containing the invalid event error', async () => {
                    const setupData = {
                        ...this.setupData,
                        validatedEvent: 'different',
                        isChatEnded: false
                    }

                    await this.executeUsecaseWithSetupData(setupData);
                    
                    this.assertCalledWithResultModel(['Invalid chat state event']);
                });
                describe('Given state is end state', () => {
                    it('should call with error result model: Chat ended', async () => {
                        const setupData = {
                            ...this.setupData,
                            validatedEvent: 'different',
                            isChatEnded: true
                        }

                        await this.executeUsecaseWithSetupData(setupData);
                        
                        this.assertCalledWithResultModel(['Chat ended'], true);
                    });
                });
            });
            describe('Given a failed getNextState method and currentState different from nextState', () => {
                describe('Given chat has ended', () => {
                    it('should call with result model containing error for chat ended', async () => {
                        const setupData = {
                            ...this.setupData,
                            currentStateId: 'different current state id',
                            nextStateResultSuccess: false,
                            nextStateResultError: 'Invalid chat state',
                            isChatEnded: true
                        }

                        await this.executeUsecaseWithSetupData(setupData);

                        this.assertCalledWithResultModel(['Chat ended'], true);
                    });
                });
                it('should call with result model containing error for chat state', async () => {
                    const setupData = {
                        ...this.setupData,
                        currentStateId: 'different current state id',
                        nextStateResultSuccess: false,
                        nextStateResultError: 'Can\'t get next state',
                        isChatEnded: false
                    }

                    await this.executeUsecaseWithSetupData(setupData);

                    this.assertCalledWithResultModel(['Can\'t get next state']);
                });
            });
            describe('Given a failed nextStateResult and failed validation result', () => {
                it('should call out boundary with result model containing errors for chat ended', async () => {
                    const setupData = {
                        ...this.setupData,
                        currentStateId: 'different current state id',
                        nextStateResultSuccess: false,
                        nextStateResultError: 'Invalid chat state',
                        content: 'invalidContent',
                        validateResultSuccess: false,
                        validateResultError: 'Content invalid for event',
                        isChatEnded: true
                    }

                    await this.executeUsecaseWithSetupData(setupData);

                    this.assertCalledWithResultModel(['Chat ended'], true);
                });
                describe('Given state is not end state', () => {
                    it('should call out boundary with result model containing errors for chat state and content event', async () => {
                        const setupData = {
                            ...this.setupData,
                            currentStateId: 'different current state id',
                            nextStateResultSuccess: false,
                            nextStateResultError: 'Can\'t get next state',
                            content: 'invalidContent',
                            validateResultSuccess: false,
                            validateResultError: 'Content invalid for event',
                            isChatEnded: false
                        }
    
                        await this.executeUsecaseWithSetupData(setupData);
    
                        this.assertCalledWithResultModel(['Can\'t get next state', 'Content invalid for event']);
                    });
                });
            });
            describe('Given current state not end and a success nextStateResult and a different next state than the dummy current state', () => {
                it('should call with result model containing no errors', async () => {
                    const setupData = {
                        ...this.setupData,
                        nextStateId: 'different next state id',
                        nextStateResultSuccess: true,
                        isChatEnded: true
                    }

                    await this.executeUsecaseWithSetupData(setupData);

                    this.assertCalledWithResultModel([], true);
                });
                describe('Given isChatEnded false', () => {
                    it('should call with result model containing no errors', async () => {
                        const setupData = {
                            ...this.setupData,
                            nextStateId: 'different next state id',
                            nextStateResultSuccess: true,
                            isChatEnded: false
                        }
    
                        await this.executeUsecaseWithSetupData(setupData);
    
                        this.assertCalledWithResultModel([], false);
                    });
                });
            });
            describe('Given non dummy response options and isChatEnded value is false', () => {
                it('should call with result model containing the non dummy response options', async () => {
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
                        },
                        isChatEnded: false
                    }

                    await this.executeUsecaseWithSetupData(setupData);

                    const expectedResponseOptions = {
                        options: [{
                            responseMedia: 'text',
                            responseRestrictions: 'ValidatorId'
                        }]
                    }
                    this.assertCalledWithResultModel([], false, expectedResponseOptions);
                });
                describe('Given isChatEnded true', () => {
                    it('should call with result model containing the non dummy response options', async () => {
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
                            },
                            isChatEnded: true
                        }
    
                        await this.executeUsecaseWithSetupData(setupData);
    
                        this.assertCalledWithResultModel(['Chat ended'], true);
                    });
                });
            });
        }); 
    }

    private assertCalledWithResultModel(
        errors: string[] = [], isChatEnded: boolean = false, responseOptions: ChatResponseOptionsResult = { options: [] }) {
        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining(errors),
            isChatEnded: isChatEnded,
            responseOptionsForParticipant: responseOptions
        }));
    }
}

const test = new ProceedInChatUseCaseIntegrationSingleRequestTest();
test.runTests();