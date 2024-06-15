import { response } from "express";
import ProceedInChatUseCase from "../../../src/useCases/current/proceedInChatUseCase";
import ProceedInChatUseCaseBaseTest from "./proceedInChatUseCaseTestBase";

class ProceedInChatUseCaseProcessInputTest extends ProceedInChatUseCaseBaseTest {
    runTests() {
        describe.skip('Given an usecaseOutBoundarySpy, a chatGateway stub, chatFlowGateway stub, usecase stub', () => {
            describe('Given a request model stub with input validated on successful stub event', () => {
                it('should call the out boundary with a result model containing the state for an empty event input', async () => {
                    const setupData = {
                        ...this.setupData,
                        nextStateId: 'afterEmptyEventStateId',
                        content: '',
                    }

                    const { usecase, requestModel } = this.generateUsecaseAndRequestModelBasedOnSetupDataForSingleRequestSingleParticipator(setupData);
                    await usecase.executeProceedInChat(requestModel);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        chatNextStateId: 'afterEmptyEventStateId'
                    }));
                });
            });

            describe('Given a request model stub with input validated on failed stub event', () => {
                it('should call the out boundary with a result model containing error and success set to false', async () => {                    
                    const setupData = {
                        ...this.setupData,
                        content: 'content inavalidated for event',
                        validateResultSuccess: false,
                        validateResultError: 'Content invalid for event',
                    }

                    const { usecase, requestModel } = this.generateUsecaseAndRequestModelBasedOnSetupDataForSingleRequestSingleParticipator(setupData);
                    await usecase.executeProceedInChat(requestModel);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                        errors: expect.arrayContaining(['Content invalid for event']),
                        chatNextStateId: ''
                    }));
                })
            });

            describe('Given a request model stub with input validated on a successful specific stub event', () => {
                describe('Given a chatGateway, chatFlow and validationGateway stubs with a specific event', () => {
                    it('should call the out boundary with a result model with success and the state corresponding to the event', async () => {
                        const setupData = {
                            ...this.setupData,
                            nextStateId: 'specificStateId',
                            content: 'content validated for specific event',
                            validatedEvent: 'specificEvent',
                            proceedEvent: 'specificEvent'
                        }
                        
                        const { usecase, requestModel } = this.generateUsecaseAndRequestModelBasedOnSetupDataForSingleRequestSingleParticipator(setupData);
                        await usecase.executeProceedInChat(requestModel);

                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            chatNextStateId: 'specificStateId'
                        }));
                    });
                });
            });
        });
    }
}

const proceedInChatUseCaseProcessInputTest = new ProceedInChatUseCaseProcessInputTest();
proceedInChatUseCaseProcessInputTest.runTests();