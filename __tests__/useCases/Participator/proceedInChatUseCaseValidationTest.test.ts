import ProceedInChatRequestModel from '../../../src/dataModels/useCaseBoundaries/specific/proceedInChatRequestModel';
import ProceedInChatUseCase from '../../../src/useCases/current/proceedInChatUseCase';
import ResponseValidationGateway from '../../../src/boundaries/gateways/responseValidation/responseValidationGateway';
import ProceedInChatUseCaseTestBase from './proceedInChatUseCaseTestBase';

class ProceedInChatValidationUseCaseTest extends ProceedInChatUseCaseTestBase{
    runTests() {
        describe.skip('Given a spy usecaseOutBoundary, a stub participant 1 User ID and a stub request model', () => {                      
            describe('Given a stub chat gateway with an invalid chat', () => {
                describe('Given a stub request model with empty chat id', () => {                   
                    it(`should return an 'Invalid chat id' result`, async () => {
                        const setupData = {
                            ...this.setupData,
                            chatId: '',
                            chatGatewayResultSuccess: false,
                            chatGatewayResultError: 'Invalid chat id'
                        }
    
                        const { usecase, requestModel } = this.generateUsecaseAndRequestModelBasedOnSetupDataForSingleRequestSingleParticipator(setupData);
                        await usecase.executeProceedInChat(requestModel);

                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                            errors: expect.arrayContaining(('Invalid chat id'))
                        }));
                    });
                });
            });
            
            describe('Given participator 2 ID, stub state input, stub chat entity and stub gateway result', () => {            
                describe('Given a stub empty success gateway', () => {
                    describe('Given a stub request model with empty user id', () => {
                        const setupData = {
                            ...this.setupData,
                            requestModelUserId: '',
                            nextStateId: 'nextState'
                        }

                        const expectedError = 'User is not a participator in this chat';
                        it(`should return an ${expectedError} result`, async () => {
                            const { usecase, requestModel } = this.generateUsecaseAndRequestModelBasedOnSetupDataForSingleRequestSingleParticipator(setupData);
                            await usecase.executeProceedInChat(requestModel);

                            expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(expect.objectContaining({
                                errors: expect.arrayContaining((expectedError))
                            }));
                        });
                    });
                });
            });
        });
    }
}

const validationTest = new ProceedInChatValidationUseCaseTest();
validationTest.runTests();