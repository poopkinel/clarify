import ChatGatewayToViewChat from "../../../src/boundaries/gateways/chatGatewayToViewChat";
import ViewChatAsUserUseCase from "../../../src/useCases/current/viewChatAsUserUseCase";

class ViewAChatAsUserUseCaseTest {
    runTests() {
        describe('Given a use case created with dummy chat gateway and usecaseOutBoundary', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }
            
            const dummyUserId = '';
            const dummyChatId = '';

            const dummyChatEntity = {
                id: '',
                participator1UserId: '',
                participator2UserId: '',
                name: dummyChatId,
                access: '',
                responses: [],
                sharingSettings: {
                    getLink: jest.fn().mockResolvedValue('')
                },
                getLink: jest.fn().mockResolvedValue('')
            }
            const chatGatewayDummy: ChatGatewayToViewChat = {
                getChatById: jest.fn().mockResolvedValue(dummyChatEntity)
            }
            const dummyUseCase = new ViewChatAsUserUseCase(chatGatewayDummy, usecaseOutBoundarySpy);

            describe('Given a dummy request model', () => {
                const dummyRequestModel = {
                    userId: dummyUserId,
                    chatId: dummyChatId
                }
                it('should return a valid result model', async () => {
                    await dummyUseCase.viewChatAsUser(dummyRequestModel);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith({
                        chatId: dummyChatId,
                        participator1UserId: dummyUserId,
                        participator2UserId: dummyUserId,
                        chatName: '',
                        access: '',
                        responses: []
                    });
                });
            });
        });
    }
}

const viewAChatAsUserUseCaseTest = new ViewAChatAsUserUseCaseTest();
viewAChatAsUserUseCaseTest.runTests();