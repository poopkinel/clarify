import { ChatResponseOptionsResult } from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatResultModel';
import ProceedInChatUseCaseBaseTest from './proceedInChatUseCaseTestBase';

class ProceedInChatUseCaseIntegrationSingleRequestTest extends ProceedInChatUseCaseBaseTest {
    runTests() {
        describe('Test flow for single request', () => {
            describe('Given the chat is already in end state', () => {
                it('should call with error result model: Chat ended', async () => {
                    const setupData = {
                        ...this.setupData,
                        isCurrentStateEndState: true
                    }
                    await this.executeUsecaseWithSetupData(setupData);   
                    this.assertCalledWithResultModel(['Chat ended']);
                });
            });
            describe('Given dummy response options, and dummy isEndState value for the dummy next state', () => {
                describe('Given dummy getNextState method giving the same dummy state as current state (with dummy validated event)', () => {
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
                        describe('Given dummy content and success validation result with different validated event', () => {
                            it('should call with result model containing the invalida event error', async () => {
                                const setupData = {
                                    ...this.setupData,
                                    validatedEvent: 'different'
                                }

                                await this.executeUsecaseWithSetupData(setupData);

                                expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                    errors: expect.arrayContaining(['Invalid chat state event']),
                                }));
                            });
                        });
                    });
                    describe('Given non dummy current state, and failed nextStateResult', () => {
                        describe('Given dummy content and success validation result', () => {
                            it('should call with result model containing error for chat state', async () => {
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
                            nextStateResultSuccess: true,
                            isCurrentStateEndState: false
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
                        },
                        isCurrentStateEndState: false
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
                        isNextStateEndState: false,
                        isCurrentStateEndState: false
                    }

                    await this.executeUsecaseWithSetupData(setupData);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        isEndState: false
                    }));
                });
            });
        }); 
    }

    private assertCalledWithResultModel(
        errors: string[] = [], isEndState: boolean = true, responseOptions: ChatResponseOptionsResult = { options: [] }) {
        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
            errors: expect.arrayContaining(errors),
            isEndState: isEndState,
            responseOptionsForParticipant: responseOptions
        }));
    }
}

const test = new ProceedInChatUseCaseIntegrationSingleRequestTest();
test.runTests();