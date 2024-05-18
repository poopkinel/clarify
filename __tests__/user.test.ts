import ShareAChatAsUserRequestModel from '../src/dataModels/current/specific/shareAChatAsUserRequestModel'
import ShareAChatAsUserResultModel from '../src/dataModels/current/specific/shareAChatAsUserResultModel'
import ShareAChatAsUserUseCase from '../src/useCases/current/shareAChatAsUserUseCase'
import ChatGateway from '../src/boundaries/gateways/chatGateway'
import ChatGatewayMockImpl from '../src/details/persistence/current/chatGatewayMockImpl'
import { ResponseEntity, ResponseType } from '../src/entities/responseEntity'
import ChatSharingSettingsForSharingOptions from '../src/entities/chatSharingSettingsForSharingOptions'

class ShareAChatAsUserUseCaseTest {
    private usecaseOutBoundary: any;
    private emptyDataShareAChatAsUserUseCase: any;
    private emptyDataMockRequest: any;
    private mockPlaceholderResultModel: any;
    private mockPlaceholderResultModelKeyValueWithEmptyResponses: any;
    private mockPlaceholderChatId: any;
    private mockPlaceholderUserId: any;
    private mockSharingOptions: any;
    private chatGatewayMockWithEmtpyData: any;
    private mockResponseText: any;
    private mockOnStateId: any;
    private mockOptions: any;


    setup() {
        this.usecaseOutBoundary = {
            sendStartNewChatResult: jest.fn()
        }
        
        this.mockSharingOptions = {
            getSharingOptions: jest.fn().mockReturnValue(["option1", "option2"])
        }
        
        this.chatGatewayMockWithEmtpyData = {
            createChat: jest.fn(),
            getAllChats: jest.fn(),
            deleteChat: jest.fn(),
            getChatById: jest.fn().mockResolvedValue({
                responses: [],
                sharingSettings:
                {
                    getSharingOptions: jest.fn().mockReturnValue([])
                }
            })
        }
        
        this.mockPlaceholderChatId = "chatId";
        this.mockPlaceholderUserId = "userId";
        
        this.mockPlaceholderResultModel = new ShareAChatAsUserResultModel(
            this.mockPlaceholderChatId,
            this.mockPlaceholderUserId,
            [],
            "all",
            "error",
            []
        );
        
        this.mockPlaceholderResultModelKeyValueWithEmptyResponses = {
            chatId: this.mockPlaceholderChatId,
            userId: this.mockPlaceholderUserId,
            responses: [],
            access: "all",
            error: "error",
            sharingOptions: []
        }
        
        this.emptyDataShareAChatAsUserUseCase = this.setupEmptyDataUseCase();
        this.emptyDataMockRequest = this.setupMockRequest();
        
        this.mockResponseText = "test text";
        this.mockOnStateId = "Test state";
        
        this.mockOptions = ["option1", "option2"];     
        
    }

    setupEmptyDataUseCase = () => {
        return new ShareAChatAsUserUseCase(this.usecaseOutBoundary, this.chatGatewayMockWithEmtpyData)
    }
    
    setupMockRequest = () => {
        return new ShareAChatAsUserRequestModel(this.mockPlaceholderChatId, this.mockPlaceholderUserId);
    }

    setupMockGateway = (responses: ResponseEntity[], options: string[]) => {
        return {
            createChat: jest.fn(),
            getAllChats: jest.fn(),
            deleteChat: jest.fn(), 
            getChatById: jest.fn().mockResolvedValue({
                responses: responses,
                sharingSettings: {
                    getSharingOptions: jest.fn().mockReturnValue(options)
                }
            })
        }
    }

  
    runTests() {
        describe('ShareAChatAsUserUseCase', () => {

            it('should call sendStartNewChatResult on usecaseOutBoundary', async () => {
                await this.emptyDataShareAChatAsUserUseCase.shareAChatAsUser(this.emptyDataMockRequest);
                expect(this.usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalled();
            });
            it('should call sendStartNewChatResult on usecaseOutBoundary with a result model', async () => {
                await this.emptyDataShareAChatAsUserUseCase.shareAChatAsUser(this.emptyDataMockRequest);
                expect(this.usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(this.mockPlaceholderResultModel);
            });
        
            it('should map empty responseEntities to empty responses', async () => {
                const request = new ShareAChatAsUserRequestModel(this.mockPlaceholderChatId, this.mockPlaceholderUserId);
                await this.emptyDataShareAChatAsUserUseCase.shareAChatAsUser(request);
        
                expect(this.usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(this.mockPlaceholderResultModelKeyValueWithEmptyResponses);
            });
        
            it('should map non-empty responseEntities to valid responses', async () => {
                const mockResponses = [
                    new ResponseEntity(
                        "testResponseId",
                        "testChatId",
                        "testUserId",
                        ResponseType.TEXT,
                        "test text",
                        new Date(),
                        new Date(),
                        "testFlowId",
                        "Test state"
                    )
                ];
                const chatGatewayWithSingleResponse: ChatGateway = this.setupMockGateway(mockResponses, []);
                const singleResponseUseCase = new ShareAChatAsUserUseCase(this.usecaseOutBoundary, chatGatewayWithSingleResponse)
        
                await singleResponseUseCase.shareAChatAsUser(this.emptyDataMockRequest);
        
                expect(this.usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
                    this.mockPlaceholderChatId,
                    this.mockPlaceholderUserId,
                    [{ text: this.mockResponseText, onStateId: this.mockOnStateId}],
                    "all",
                    "error",
                    []
                ));
            });
        
            it('should return the sharing options from the chatGateway', async () => {
                const chatGatewayWithOptions: ChatGateway = this.setupMockGateway([], this.mockOptions);
        
                const shareAChatAsUserUseCase = new ShareAChatAsUserUseCase(this.usecaseOutBoundary, chatGatewayWithOptions)
                const request = new ShareAChatAsUserRequestModel(this.mockPlaceholderChatId, this.mockPlaceholderUserId);
                await shareAChatAsUserUseCase.shareAChatAsUser(request);
        
                expect(this.usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalled();
                expect(this.usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
                    this.mockPlaceholderChatId,
                    this.mockPlaceholderUserId,
                    [],
                    "all",
                    "error",
                    await this.mockSharingOptions.getSharingOptions()
                ));
            });
        })
    }
  }
  
  const test = new ShareAChatAsUserUseCaseTest();
  test.setup();
  test.runTests();





