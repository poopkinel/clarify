import ChatGatewayToViewChatHistory from "../../../src/boundaries/gateways/chatGatewayToViewChatHistory";
import ViewChatHistoryAsUserUseCase from "../../../src/useCases/current/viewChatHistoryAsUserUseCase";
import ViewChatHistoryAsUserResultModel from "../../../src/dataModels/current/specific/viewChatHistoryAsUserResultModel";
import ViewChatHistoryAsUserRequestModel from "../../../src/dataModels/current/specific/viewChatHistoryAsUserRequestModel";
import { ResponseType } from "../../../src/entities/responseEntity";

class ViewChatHistoryAsUserTest {
    private usecaseOutBoundary: any;

    setup() {
        this.usecaseOutBoundary = {
            sendResultModel: jest.fn()
        }
    }
    
    setupAllDummies() {
        const dummyUserId: any = "userId";
        const dummyChatId: any = "chatId";
        const dummyChatHistory: any = [];
        const dummychatGateway: ChatGatewayToViewChatHistory = {
            getChatHistoryById: jest.fn().mockResolvedValue(dummyChatHistory)
        };
        
        const useCase = new ViewChatHistoryAsUserUseCase(this.usecaseOutBoundary, dummychatGateway);
        const dummyRequestModel = new ViewChatHistoryAsUserRequestModel(dummyChatId, dummyUserId);
        return { useCase, dummyRequestModel, placeholderUserId: dummyUserId, dummyChatHistory };
    }
    
    setupUsecaseWithNonEmptyChatHistory() {
        const stubChatHistory: any = [
            {
                id: "chatId",
                user1: "user1",
                user2: "user2",
                responses: [{
                    text: "text",
                    id: "responseId",
                    type: ResponseType.TEXT
                }]
            }
        ];
        const chatGatewayStubHistory: ChatGatewayToViewChatHistory = {
            getChatHistoryById: jest.fn().mockResolvedValue(stubChatHistory)
        };
    
        const useCase = new ViewChatHistoryAsUserUseCase(this.usecaseOutBoundary, chatGatewayStubHistory);
        return useCase;
    }

    

    runTests() {
        describe('Given a dummy chatGateway, usecaseOutBoundary, chatHistory and requestModel', () => {
            var { useCase: viewChatHistoryAsUserUseCase, 
                    dummyRequestModel, 
                    placeholderUserId, 
                    dummyChatHistory }: { 
                        useCase: ViewChatHistoryAsUserUseCase; 
                        placeholderUserId: any;
                        dummyRequestModel: ViewChatHistoryAsUserRequestModel; 
                        dummyChatHistory: any; } = this.setupAllDummies();

            it('should call usecaseOutBoundary.sendResultModel with a valid dummy response model', async () => {
                await viewChatHistoryAsUserUseCase.executeViewChatHistory(dummyRequestModel);
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ViewChatHistoryAsUserResultModel(placeholderUserId, dummyChatHistory)
                );
            });

            describe('Given only non-empty chatHistory', () => {
                const useCase = this.setupUsecaseWithNonEmptyChatHistory();

                it('should call usecaseOutBoundary.sendResultModel with a response model containing chat history', async () => {
                    await useCase.executeViewChatHistory(dummyRequestModel);
            
                    var expectedChatHistory = [{
                        chatId: "chatId",
                        user1: "user1",
                        user2: "user2",
                        responses: [{
                            text: "text",
                            responseId: "responseId",
                            responseType: "text"
                        }]
                    }];

                    expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                        new ViewChatHistoryAsUserResultModel(
                            placeholderUserId,
                            expectedChatHistory
                        )
                    );
                });
            });
        });

    }
}

const test = new ViewChatHistoryAsUserTest();
test.setup();
test.runTests();