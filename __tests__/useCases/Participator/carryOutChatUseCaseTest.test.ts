import CarryOutChatUseCase from '../../../src/useCases/current/carryOutChatUseCase';
import CarryOutChatResultModel from '../../../src/dataModels/useCaseBoundaries/specific/carryOutChatResultModel';
// import ChatFlow from '../../../src/entities/chatFlow';

class CarryOutChatUseCaseTest {
    runTests() {
        describe.skip('Given a spy usecaseOutBoundary', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }
            describe('Given empty settings for chat', () => {
                describe('Given a dummy request model', () => {
                    const dummyRequestModel = {
                        userId: '',
                        chatId: ''
                    }
                    describe('Given an empty flow (start state is finish state and not other states)', () => {
                        describe('Given a dummy use case', () => {
                            const dummyUseCase = new CarryOutChatUseCase(usecaseOutBoundarySpy);
                            it('should call sendResultModel on usecaseOutBoundary with valid data', async () => {
                                await dummyUseCase.executeCarryOutChat(dummyRequestModel);
                                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalled();

                                const chatId = '';
                                const firstParticipatorId = '';
                                const secondParticipatorId = '';
                                const responses = [] as any[];
                                const chatIsFinished = true;
                                const preferredParticipatorId = '';
                                const unpreferredParticipatorId = '';
                                const currentStateId = '';

                                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                                    new CarryOutChatResultModel(
                                        chatId,
                                        firstParticipatorId,
                                        secondParticipatorId,
                                        responses,
                                        chatIsFinished,
                                        preferredParticipatorId,
                                        unpreferredParticipatorId,
                                        currentStateId
                                    )
                                );
                            });
                        });
                    });
                });
            });
        });
    }
}

const carryOutChatUseCaseTest = new CarryOutChatUseCaseTest()
carryOutChatUseCaseTest.runTests()