import ChatGatewayToViewChat from "../../../src/boundaries/gateways/chat/chatGatewayToViewChat";
import ViewChatAsUserUseCase from "../../../src/useCases/current/viewChatAsUserUseCase";

class ViewChatAsUserUseCaseTest {
    runTests() {
        describe('Given a spy usecaseOutBoundary', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }
            describe('Given a use case created with dummy chat gateway', () => {
                
                const dummyUserId = '';
                const dummyChatId = '';
                
                const dummyChatEntity = {
                    id: '',
                    participator1UserId: '',
                    participator2UserId: '',
                    name: dummyChatId,
                    access: '',
                    responses: (),
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
                    it('should return a valid dummy result model', async () => {
                        await dummyUseCase.viewChatAsUser(dummyRequestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith({
                            chatId: dummyChatId,
                            participator1UserId: dummyUserId,
                            participator2UserId: dummyUserId,
                            chatName: '',
                            access: '',
                            responses: ()
                        });
                    });
                });
            });
            
            describe('Given a stub request model and stub gateway with a stub chat and responses', () => {
                const stubUserId = 'stubUserId';
                const stubChatId = 'stubChatId';
                const stubRequestModel = {
                    userId: stubUserId,
                    chatId: stubChatId
                }
                const stubResponses = (
                    {
                        text: 'response1',
                        id: 'responseId1',
                        type: 'responseType1'
                    },
                    {
                        text: 'response2',
                        id: 'responseId2',
                        type: 'responseType2'
                    }
                )
                const participator1UserId = 'stubUserId';
                const participator2UserId = 'stubUserId';
                const stubChatName = 'stubChatName';
                const stubAccess = 'stubAccess';
                const stubChatEntity = {
                    id: stubChatId,
                    participator1UserId: participator1UserId,
                    participator2UserId: participator2UserId,
                    name: stubChatName,
                    access: stubAccess,
                    responses: stubResponses,
                    sharingSettings: {
                        getLink: jest.fn().mockResolvedValue('')
                    },
                    getLink: jest.fn().mockResolvedValue('')
                }
                const chatGatewayStub: ChatGatewayToViewChat = {
                    getChatById: jest.fn().mockResolvedValue(stubChatEntity)
                }
                const useCaseStub = new ViewChatAsUserUseCase(chatGatewayStub, usecaseOutBoundarySpy);
                
                it('should return a valid stub result model', async () => {
                    await useCaseStub.viewChatAsUser(stubRequestModel);
                    expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith({
                        chatId: stubRequestModel.chatId,
                        participator1UserId: participator1UserId,
                        participator2UserId: participator2UserId,
                        chatName: stubChatName,
                        access: stubAccess,
                        responses: ({
                            text: stubResponses(0).text,
                            responseId: stubResponses(0).id,
                            responseType: stubResponses(0).type
                        
                        },
                        {
                            text: stubResponses(1).text,
                            responseId: stubResponses(1).id,
                            responseType: stubResponses(1).type
                        })
                    });
                });
            });
        });
    }
};
    
const viewChatAsUserUseCaseTest = new ViewChatAsUserUseCaseTest();
viewChatAsUserUseCaseTest.runTests();