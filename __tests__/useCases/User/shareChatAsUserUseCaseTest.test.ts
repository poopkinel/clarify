import AttemptShareChatAsUserRequestModel from '../../../src/dataModels/current/specific/shareChatAsUserRequestModel'
import ShareChatAsUserResultModel from '../../../src/dataModels/current/specific/shareChatAsUserResultModel'
import ShareChatAsUserUseCase from '../../../src/useCases/current/shareChatAsUserUseCase'
import ChatGatewayToShareChat from '../../../src/boundaries/gateways/chatGatewayToShareChat'

class ShareChatAsUserUseCaseTest {
    private usecaseOutBoundary: any;
    private dummyResultModel: any;
    private dummyChatId: any = "chatId";
    private dummyUserId: any = "userId";
    private mockSharingSettings: any;
    private chatGatewayDummy: any;
    private dummyEmptyLink: any = "";
    private stubLink: any = "https://www.clarify.mock/0";
    private dummyAccess: any = "all";
    private stubSharingSettingsNoErrorMessage: any = "";
    private mockSharingSettingsUserNotAuthorizedErrorMessage: any = "User not authorized to share chat";

    setup() {
        this.usecaseOutBoundary = {
            sendResultModel: jest.fn()
        }
        
        this.mockSharingSettings = {
            getLink: jest.fn().mockReturnValue(this.stubLink)
        }
        
        this.chatGatewayDummy = {
            getChatById: jest.fn().mockResolvedValue({
                sharingSettings:
                {
                    getLink: jest.fn().mockReturnValue(this.dummyEmptyLink),
                    canUserShare: jest.fn().mockReturnValue(true)
                }
            })
        }
        
        this.dummyResultModel = new ShareChatAsUserResultModel(
            this.dummyChatId,
            this.dummyUserId,
            this.dummyAccess,
            this.stubSharingSettingsNoErrorMessage,
            this.dummyEmptyLink
        );
    }
    
    setupMockResultModelKeyValuePairs = (chatId: string, userId: string, 
                                        access: string, error: string, link: string) => {
        return {
            chatId: chatId,
            userId: userId,
            access: access,
            error: error,
            link: link,
        }
    }

    setupStubUseCase = () => {
        return new ShareChatAsUserUseCase(this.usecaseOutBoundary, this.chatGatewayDummy)
    }

    setupUsecaseWithDefaultBoundary = (chatGateway: ChatGatewayToShareChat) => {
        return new ShareChatAsUserUseCase(this.usecaseOutBoundary, chatGateway)
    }
    
    setupStubRequest = () => {
        return new AttemptShareChatAsUserRequestModel(this.dummyChatId, this.dummyUserId);
    }

    setupStubGateway = (link: string, canUserShareChat: boolean) => {
        return {
            getChatById: jest.fn().mockResolvedValue({
                sharingSettings: {
                    canUserShare: jest.fn().mockReturnValue(canUserShareChat),
                    getLink: jest.fn().mockReturnValue(link)
                }
            })
        }
    }

    executeUseCaseWithStubRequestAndGateway = async (chatGateway: ChatGatewayToShareChat) => {
        const useCase = this.setupUsecaseWithDefaultBoundary(chatGateway);
        await useCase.executeShareChat(this.setupStubRequest());
    }

  
    runTests() {
        describe('Given an empty data use case and a dummy request', () => {

            it('should call sendResultModel on usecaseOutBoundary', async () => {
                await this.setupStubUseCase().executeShareChat(this.setupStubRequest());
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
            });
            it('should call sendResultModel on usecaseOutBoundary with a result model', async () => {
                await this.setupStubUseCase().executeShareChat(this.setupStubRequest());
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(this.dummyResultModel);
            });
        });

        describe('Given a chatGateway with a chat that can be shared', () => {
            const request = new AttemptShareChatAsUserRequestModel(this.dummyChatId, this.dummyUserId);

            it('should return the sharing options from the chatGateway', async () => {
                const chatGatewayStubWithLink: ChatGatewayToShareChat = this.setupStubGateway(this.stubLink, true);
                await this.executeUseCaseWithStubRequestAndGateway(chatGatewayStubWithLink);
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(new ShareChatAsUserResultModel(
                    this.dummyChatId,
                    this.dummyUserId,
                    this.dummyAccess,
                    this.stubSharingSettingsNoErrorMessage,
                    await this.mockSharingSettings.getLink()
                ));
            });

            it('should get chat enitity interface with only sharing relevant data', async () => {
                const chat = this.chatGatewayDummy.getChatById(request.chatId);
                expect(chat).not.toHaveProperty('name');
                expect(chat).not.toHaveProperty('user1');
                expect(chat).not.toHaveProperty('user2');
                expect(chat).not.toHaveProperty('responses');
                expect(chat).not.toHaveProperty('createdAt');
                expect(chat).not.toHaveProperty('updatedAt');
            });

            it('should return a valid link', async () => {
                const canShareChatGateway: ChatGatewayToShareChat = this.setupStubGateway(this.stubLink, true);
                await this.executeUseCaseWithStubRequestAndGateway(canShareChatGateway);
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareChatAsUserResultModel(
                        this.dummyChatId,
                        this.dummyUserId,
                        this.dummyAccess,
                        this.stubSharingSettingsNoErrorMessage,
                        this.stubLink
                    )
                );
            });

        });
        describe('Given a chatGateway with a chat that can\'t be shared', () => {
            it('on user can\'t share chat, should return appropriate result', async () => {
                const cantShareChatGateway: ChatGatewayToShareChat = this.setupStubGateway("RandomLink", false);
                await this.executeUseCaseWithStubRequestAndGateway(cantShareChatGateway);
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareChatAsUserResultModel(
                        this.dummyChatId,
                        this.dummyUserId,
                        this.dummyAccess,
                        this.mockSharingSettingsUserNotAuthorizedErrorMessage,
                        this.dummyEmptyLink
                    )
                );
            });
        });
        describe('Given multiple chats', () => {
            it('should return different links for different chats', async () => {
                const chatGatewayWithDifferentLink: ChatGatewayToShareChat = this.setupStubGateway("DifferentLink", true);
                const shareChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(chatGatewayWithDifferentLink)
                await shareChatAsUserUseCase.executeShareChat(this.setupStubRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareChatAsUserResultModel(
                        this.dummyChatId,
                        this.dummyUserId,
                        this.dummyAccess,
                        this.stubSharingSettingsNoErrorMessage,
                        "DifferentLink"
                    )
                );
            });
        });
    }
  }
  
  const test = new ShareChatAsUserUseCaseTest();
  test.setup();
  test.runTests();