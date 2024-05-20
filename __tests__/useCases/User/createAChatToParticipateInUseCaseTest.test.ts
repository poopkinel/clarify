import CreateAChatAsUserToBeParticipantUseCase from '../../../src/useCases/current/createAChatAsUserToBeParticipantUseCase'
import ChatGatewayToCreateChatToBeParticipant from '../../../src/boundaries/gateways/chatGatewayToCreateChatToBeParticipant'
import UsecaseOutBoundary from '../../../src/boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateAChatAsUserToBeParticipantRequestModel from '../../../src/dataModels/current/specific/createAChatAsUserToBeParticipantRequestModel';

class CreateAChatToParticipateInUseCaseTest {
    setup() {
    }

    runTests() {
        describe('Given a use case created with dummy chat gateway', () => {
            const chatGatewayDummy: ChatGatewayToCreateChatToBeParticipant = {
                createChatToBeParticipant: jest.fn()
            }
            const usecaseOutBoundaryDummy: UsecaseOutBoundary<CreateAChatAsUserToBeParticipantRequestModel> = {
                sendResultModel: jest.fn()
            }

            const useCase = new CreateAChatAsUserToBeParticipantUseCase(chatGatewayDummy, usecaseOutBoundaryDummy);

            it('should create a stub use case with a dummy gateway', async () => {
                expect(useCase).toBeDefined();
            });

            it('should call usecaseOutBoundary.sendResultModel', async () => {
                const usecaseOutBoundaryDummy: UsecaseOutBoundary<CreateAChatAsUserToBeParticipantRequestModel> = {
                    sendResultModel: jest.fn()
                }
                const useCase = new CreateAChatAsUserToBeParticipantUseCase(chatGatewayDummy, usecaseOutBoundaryDummy);
                await useCase.executeCreateChatToBeParticipant('userId', 'chatName');
                expect(usecaseOutBoundaryDummy.sendResultModel).toHaveBeenCalled();
            });

            // it('should call chatGateway.createChatToBeParticipant with a chatId and userId', async () => {
            //     const chatId = 'chatId';
            //     const userId = 'userId';
            //     await useCase.executeCreateChatToBeParticipant(chatId, userId);
            //     expect(chatGatewayDummy.createChatToBeParticipant).toHaveBeenCalledWith(chatId, userId);
            // });
        });
    }
}

const usecaseTest = new CreateAChatToParticipateInUseCaseTest();
usecaseTest.setup();
usecaseTest.runTests();