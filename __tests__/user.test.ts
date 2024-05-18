import AttemptShareAChatAsUserRequestModel from '../src/dataModels/current/specific/shareAChatAsUserRequestModel'
import ShareAChatAsUserResultModel from '../src/dataModels/current/specific/shareAChatAsUserResultModel'
import ShareChatAsUserUseCase from '../src/useCases/current/shareAChatAsUserUseCase'
import ChatGateway from '../src/boundaries/gateways/chatGateway'

class ShareAChatAsUserUseCaseTest {
    private usecaseOutBoundary: any;
    private mockPlaceholderResultModel: any;
    private mockPlaceholderChatId: any = "chatId";
    private mockPlaceholderUserId: any = "userId";
    private mockSharingSettings: any;
    private chatGatewayMockWithBaseData: any;
    private mockEmptyLink: any = "";
    private mockLink: any = "https://www.clarify.mock/0";
    private mockAccess: any = "all";
    private mockSharingSettingsNoErrorMessage: any = "";
    private mockSharingSettingsUserNotAuthorizedErrorMessage: any = "User not authorized to share chat";

    setup() {
        this.usecaseOutBoundary = {
            sendResultModel: jest.fn()
        }
        
        this.mockSharingSettings = {
            getLink: jest.fn().mockReturnValue(this.mockLink)
        }
        
        this.chatGatewayMockWithBaseData = {
            createChat: jest.fn(),
            getAllChats: jest.fn(),
            deleteChat: jest.fn(),
            getChatById: jest.fn().mockResolvedValue({
                sharingSettings:
                {
                    getLink: jest.fn().mockReturnValue(this.mockEmptyLink),
                    canUserShare: jest.fn().mockReturnValue(true)
                }
            })
        }
        
        this.mockPlaceholderResultModel = new ShareAChatAsUserResultModel(
            this.mockPlaceholderChatId,
            this.mockPlaceholderUserId,
            this.mockAccess,
            this.mockSharingSettingsNoErrorMessage,
            this.mockEmptyLink
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
        return new ShareChatAsUserUseCase(this.usecaseOutBoundary, this.chatGatewayMockWithBaseData)
    }

    setupUsecaseWithDefaultBoundary = (chatGateway: ChatGateway) => {
        return new ShareChatAsUserUseCase(this.usecaseOutBoundary, chatGateway)
    }
    
    setupMockRequest = () => {
        return new AttemptShareAChatAsUserRequestModel(this.mockPlaceholderChatId, this.mockPlaceholderUserId);
    }

    setupMockGateway = (link: string, canUserShareChat: boolean) => {
        return {
            createChat: jest.fn(),
            getAllChats: jest.fn(),
            deleteChat: jest.fn(), 
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
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(this.mockPlaceholderResultModel);
            });
        
            it('should return the sharing options from the chatGateway', async () => {
                const chatGatewayWithLink: ChatGateway = this.setupMockGateway(this.mockLink, true);
        
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(chatGatewayWithLink);
                const request = new AttemptShareAChatAsUserRequestModel(this.mockPlaceholderChatId, this.mockPlaceholderUserId);
                await shareAChatAsUserUseCase.executeShareChat(request);
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
                    this.mockPlaceholderChatId,
                    this.mockPlaceholderUserId,
                    this.mockAccess,
                    this.mockSharingSettingsNoErrorMessage,
                    await this.mockSharingSettings.getLink()
                ));
            });

            it('on user can\'t share chat, should return appropriate result', async () => {
                const cantShareChatGateway: ChatGateway = this.setupMockGateway("RandomLink", false);
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(cantShareChatGateway)
                await shareAChatAsUserUseCase.executeShareChat(this.setupMockRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareAChatAsUserResultModel(
                        this.mockPlaceholderChatId,
                        this.mockPlaceholderUserId,
                        this.mockAccess,
                        this.mockSharingSettingsUserNotAuthorizedErrorMessage,
                        this.mockEmptyLink
                    )
                );
            });
            
            it('should return a valid link when authorized to share chat', async () => {
                const canShareChatGateway: ChatGateway = this.setupMockGateway(this.mockLink, true);
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(canShareChatGateway)
                await shareAChatAsUserUseCase.executeShareChat(this.setupMockRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareAChatAsUserResultModel(
                        this.mockPlaceholderChatId,
                        this.mockPlaceholderUserId,
                        this.mockAccess,
                        this.mockSharingSettingsNoErrorMessage,
                        this.mockLink
                    )
                );
            });

            it('should return different links for different chats', async () => {
                const chatGatewayWithDifferentLink: ChatGateway = this.setupMockGateway("DifferentLink", true);
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(chatGatewayWithDifferentLink)
                await shareAChatAsUserUseCase.executeShareChat(this.setupMockRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareAChatAsUserResultModel(
                        this.mockPlaceholderChatId,
                        this.mockPlaceholderUserId,
                        this.mockAccess,
                        this.mockSharingSettingsNoErrorMessage,
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