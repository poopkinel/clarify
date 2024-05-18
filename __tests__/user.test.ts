import ShareAChatAsUserRequestModel from '../src/dataModels/current/specific/shareAChatAsUserRequestModel'
import ShareAChatAsUserResultModel from '../src/dataModels/current/specific/shareAChatAsUserResultModel'
import ShareAChatAsUserUseCase from '../src/useCases/current/shareAChatAsUserUseCase'
import ChatGateway from '../src/boundaries/gateways/chatGateway'
import { ResponseEntity, ResponseType } from '../src/entities/responseEntity'

class ShareAChatAsUserUseCaseTest {
    private usecaseOutBoundary: any;
    private mockPlaceholderResultModel: any;
    private mockPlaceholderChatId: any = "chatId";
    private mockPlaceholderUserId: any = "userId";
    private mockSharingSettings: any;
    private chatGatewayMockWithBaseData: any;
    private mockResponseText: any = "text";
    private mockOnStateId: any = "state";
    private mockEmptyOptions: any = [];
    private mockOptionsList: any = ["option1", "option2"];
    private mockEmptyResponses: any = [];
    private mockAccess: any = "all";
    private mockSharingSettingsNoErrorMessage: any = "";
    private mockSharingSettingsUserNotAuthorizedErrorMessage: any = "User not authorized to share chat";
    private mockResponseEntity: any = new ResponseEntity(
        "plachodler ResponseId",
        "placeholder ChatId",
        "placeholder UserId",
        ResponseType.TEXT,
        this.mockResponseText,
        new Date(),
        new Date(),
        "placeholder FlowId",
        this.mockOnStateId
    );

    setup() {
        this.usecaseOutBoundary = {
            sendResultModel: jest.fn()
        }
        
        this.mockSharingSettings = {
            getSharingOptions: jest.fn().mockReturnValue(this.mockOptionsList)
        }
        
        this.chatGatewayMockWithBaseData = {
            createChat: jest.fn(),
            getAllChats: jest.fn(),
            deleteChat: jest.fn(),
            getChatById: jest.fn().mockResolvedValue({
                responses: [],
                sharingSettings:
                {
                    userIdsWhiteList: [this.mockPlaceholderUserId],
                    getSharingOptions: jest.fn().mockReturnValue([]),
                    canUserShare: jest.fn().mockReturnValue(true)
                }
            })
        }
        
        this.mockPlaceholderResultModel = new ShareAChatAsUserResultModel(
            this.mockPlaceholderChatId,
            this.mockPlaceholderUserId,
            this.mockEmptyResponses,
            this.mockAccess,
            this.mockSharingSettingsNoErrorMessage,
            this.mockEmptyOptions
        );
    }
    
    setupMockResultModelKeyValuePairs = (chatId: string, userId: string, responses: any[], 
                                        access: string, error: string, sharingOptions: string[]) => {
        return {
            chatId: chatId,
            userId: userId,
            responses: responses,
            access: access,
            error: error,
            sharingOptions: sharingOptions,
        }
    }

    setupEmptyDataUseCase = () => {
        return new ShareAChatAsUserUseCase(this.usecaseOutBoundary, this.chatGatewayMockWithBaseData)
    }

    setupUsecaseWithDefaultBoundary = (chatGateway: ChatGateway) => {
        return new ShareAChatAsUserUseCase(this.usecaseOutBoundary, chatGateway)
    }
    
    setupMockRequest = () => {
        return new ShareAChatAsUserRequestModel(this.mockPlaceholderChatId, this.mockPlaceholderUserId);
    }

    setupMockGateway = (responses: ResponseEntity[], options: string[], canUserShareChat: boolean) => {
        return {
            createChat: jest.fn(),
            getAllChats: jest.fn(),
            deleteChat: jest.fn(), 
            getChatById: jest.fn().mockResolvedValue({
                responses: responses,
                sharingSettings: {
                    userIdsWhiteList: [this.mockPlaceholderUserId],
                    canUserShare: jest.fn().mockReturnValue(canUserShareChat),
                    getSharingOptions: jest.fn().mockReturnValue(options)
                }
            })
        }
    }

  
    runTests() {
        describe('ShareAChatAsUserUseCase', () => {

            it('should call sendResultModel on usecaseOutBoundary', async () => {
                await this.setupEmptyDataUseCase().shareAChatAsUser(this.setupMockRequest());
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
            });
            it('should call sendResultModel on usecaseOutBoundary with a result model', async () => {
                await this.setupEmptyDataUseCase().shareAChatAsUser(this.setupMockRequest());
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(this.mockPlaceholderResultModel);
            });
        
            it('should map empty responseEntities to empty responses', async () => {
                await this.setupEmptyDataUseCase().shareAChatAsUser(this.setupMockRequest());
                const resultModelKeyValuePairs = this.setupMockResultModelKeyValuePairs(
                    this.mockPlaceholderChatId,
                    this.mockPlaceholderUserId,
                    this.mockEmptyResponses,
                    this.mockAccess,
                    "",
                    this.mockEmptyOptions
                );
                
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(resultModelKeyValuePairs);
            });
        
            it('should map non-empty responseEntities to valid responses', async () => {
                const mockResponses = [
                    this.mockResponseEntity
                ];
                const chatGatewayWithSingleResponse: ChatGateway = this.setupMockGateway(mockResponses, [], true);
                const singleResponseUseCase = this.setupUsecaseWithDefaultBoundary(chatGatewayWithSingleResponse)
        
                await singleResponseUseCase.shareAChatAsUser(this.setupMockRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
                    this.mockPlaceholderChatId,
                    this.mockPlaceholderUserId,
                    [{ text: this.mockResponseText, onStateId: this.mockOnStateId}],
                    this.mockAccess,
                    this.mockSharingSettingsNoErrorMessage,
                    this.mockEmptyOptions
                ));
            });
        
            it('should return the sharing options from the chatGateway', async () => {
                const chatGatewayWithOptions: ChatGateway = this.setupMockGateway(this.mockEmptyResponses, this.mockOptionsList, true);
        
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(chatGatewayWithOptions);
                const request = new ShareAChatAsUserRequestModel(this.mockPlaceholderChatId, this.mockPlaceholderUserId);
                await shareAChatAsUserUseCase.shareAChatAsUser(request);
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
                    this.mockPlaceholderChatId,
                    this.mockPlaceholderUserId,
                    this.mockEmptyResponses,
                    this.mockAccess,
                    this.mockSharingSettingsNoErrorMessage,
                    await this.mockSharingSettings.getSharingOptions()
                ));
            });

            it('on user can\'t share chat, should return appropriate result', async () => {
                const cantShareChatGateway: ChatGateway = this.setupMockGateway([], [], false);
                const shareAChatAsUserUseCase = this.setupUsecaseWithDefaultBoundary(cantShareChatGateway)
                await shareAChatAsUserUseCase.shareAChatAsUser(this.setupMockRequest());
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ShareAChatAsUserResultModel(
                        this.mockPlaceholderChatId,
                        this.mockPlaceholderUserId,
                        this.mockEmptyResponses,
                        this.mockAccess,
                        this.mockSharingSettingsUserNotAuthorizedErrorMessage,
                        []
                    )
                );
            });
        })
    }
  }
  
  const test = new ShareAChatAsUserUseCaseTest();
  test.setup();
  test.runTests();