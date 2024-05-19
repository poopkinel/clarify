import AttemptShareAChatAsUserRequestModel from '../../../src/dataModels/current/specific/shareAChatAsUserRequestModel'
import ShareAChatAsUserResultModel from '../../../src/dataModels/current/specific/shareAChatAsUserResultModel'
import ShareChatAsUserUseCase from '../../../src/useCases/current/shareAChatAsUserUseCase'
import ChatGatewayToShareAChat from '../../../src/boundaries/gateways/chatGatewayToShareAChat'

class ShareAChatAsUserUseCaseTest {
    private usecaseOutBoundary: any;
    private dummyResultModel: any;
    private dummyChatId: any = "chatId";
    private dummyUserId: any = "userId";
    private mockSharingSettings: any;
    private chatGatewayDymmy: any;
    private dummyEmptyLink: any = "";
    private mockLink: any = "https://www.clarify.mock/0";
    private dummyAccess: any = "all";
    private stubSharingSettingsNoErrorMessage: any = "";
    private mockSharingSettingsUserNotAuthorizedErrorMessage: any = "User not authorized to share chat";

    setup() {
        this.usecaseOutBoundary = {
            sendResultModel: jest.fn()
        }
        
        this.mockSharingSettings = {
            getLink: jest.fn().mockReturnValue(this.mockLink)
        }
        
        this.chatGatewayDymmy = {
            getChatById: jest.fn().mockResolvedValue({
                sharingSettings:
                {
                    getLink: jest.fn().mockReturnValue(this.dummyEmptyLink),
                    canUserShare: jest.fn().mockReturnValue(true)
                }
            })
        }
        
        this.dummyResultModel = new ShareAChatAsUserResultModel(
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

    setupEmptyDataUseCase = () => {
        return new ShareChatAsUserUseCase(this.usecaseOutBoundary, this.chatGatewayDymmy)
    }

    setupUsecaseWithDefaultBoundary = (chatGateway: ChatGatewayToShareAChat) => {
        return new ShareChatAsUserUseCase(this.usecaseOutBoundary, chatGateway)
    }
    
    setupMockRequest = () => {
        return new AttemptShareAChatAsUserRequestModel(this.dummyChatId, this.dummyUserId);
    }

    setupMockGateway = (link: string, canUserShareChat: boolean) => {
        return {
            getChatById: jest.fn().mockResolvedValue({
                sharingSettings: {
                    canUserShare: jest.fn().mockReturnValue(canUserShareChat),
                    getLink: jest.fn().mockReturnValue(link)
                }
            })
        }
    }

  
    runTests() {
        describe('Share A Chat As User Use Case', () => {

            it('should call sendResultModel on usecaseOutBoundary', async () => {
                await this.setupEmptyDataUseCase().executeShareChat(this.setupMockRequest());
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
            });
            it('should call sendResultModel on usecaseOutBoundary with a result model', async () => {
                await this.setupEmptyDataUseCase().executeShareChat(this.setupMockRequest());
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(this.dummyResultModel);
            });
        
            it('should return the sharing options from the chatGateway', async () => {
                const chatGatewayWithLink: ChatGatewayToShareAChat = this.setupMockGateway(this.mockLink, true);
        
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(chatGatewayWithLink);
                const request = new AttemptShareAChatAsUserRequestModel(this.dummyChatId, this.dummyUserId);
                await shareAChatAsUserUseCase.executeShareChat(request);
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
                    this.dummyChatId,
                    this.dummyUserId,
                    this.dummyAccess,
                    this.stubSharingSettingsNoErrorMessage,
                    await this.mockSharingSettings.getLink()
                ));
            });

            it('should get chat enitity interface with only sharing relevant data', async () => {
                const request = this.setupMockRequest();
                
                const chat = this.chatGatewayDymmy.getChatById(request.chatId);
                expect(chat).not.toHaveProperty('name');
                expect(chat).not.toHaveProperty('user1');
                expect(chat).not.toHaveProperty('user2');
                expect(chat).not.toHaveProperty('responses');
                expect(chat).not.toHaveProperty('createdAt');
                expect(chat).not.toHaveProperty('updatedAt');
            });

            it('on user can\'t share chat, should return appropriate result', async () => {
                const cantShareChatGateway: ChatGatewayToShareAChat = this.setupMockGateway("RandomLink", false);
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(cantShareChatGateway)
                await shareAChatAsUserUseCase.executeShareChat(this.setupMockRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareAChatAsUserResultModel(
                        this.dummyChatId,
                        this.dummyUserId,
                        this.dummyAccess,
                        this.mockSharingSettingsUserNotAuthorizedErrorMessage,
                        this.dummyEmptyLink
                    )
                );
            });
            
            it('should return a valid link when authorized to share chat', async () => {
                const canShareChatGateway: ChatGatewayToShareAChat = this.setupMockGateway(this.mockLink, true);
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(canShareChatGateway)
                await shareAChatAsUserUseCase.executeShareChat(this.setupMockRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareAChatAsUserResultModel(
                        this.dummyChatId,
                        this.dummyUserId,
                        this.dummyAccess,
                        this.stubSharingSettingsNoErrorMessage,
                        this.mockLink
                    )
                );
            });

            it('should return different links for different chats', async () => {
                const chatGatewayWithDifferentLink: ChatGatewayToShareAChat = this.setupMockGateway("DifferentLink", true);
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(chatGatewayWithDifferentLink)
                await shareAChatAsUserUseCase.executeShareChat(this.setupMockRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareAChatAsUserResultModel(
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
  
  const test = new ShareAChatAsUserUseCaseTest();
  test.setup();
  test.runTests();