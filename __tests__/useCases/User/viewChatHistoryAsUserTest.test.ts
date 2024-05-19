import ChatGatewayToViewChatHistory from "../../../src/boundaries/gateways/chatGatewayToViewChatHistory";
import ViewChatHistoryAsUserUseCase from "../../../src/useCases/current/viewChatHistoryAsUserUseCase";
import ViewChatHistoryAsUserResultModel from "../../../src/dataModels/current/specific/viewChatHistoryAsUserResultModel";
import ViewChatHistoryAsUserRequestModel from "../../../src/dataModels/current/specific/viewChatHistoryAsUserRequestModel";
import { ResponseType } from "../../../src/entities/responseEntity";

class ViewChatHistoryAsUserTest {
    setup() {
    }
    
    setupAllDummies() {
        const placeholderUserId: any = "userId";
        const placeholderChatId: any = "chatId";
        const dummyChatHistory: any = [];
        const chatGateway: ChatGatewayToViewChatHistory = {
            getChatHistoryById: jest.fn().mockResolvedValue(dummyChatHistory)
        };
        
        const usecaseOutBoundary: any = {
            sendResultModel: jest.fn()
        };
        
        const viewChatHistoryAsUserUseCase = new ViewChatHistoryAsUserUseCase(usecaseOutBoundary, chatGateway);
        const dummyRequestModel = new ViewChatHistoryAsUserRequestModel(placeholderChatId, placeholderUserId);
        return { viewChatHistoryAsUserUseCase, dummyRequestModel, usecaseOutBoundary, placeholderUserId, dummyChatHistory };
    }
    
    setupUsecaseWithNonEmptyChatHistory(usecaseOutBoundary: any) {
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
    
        const useCase = new ViewChatHistoryAsUserUseCase(usecaseOutBoundary, chatGatewayStubHistory);
        return useCase;
    }

    

    runTests() {
        describe('Given a dummy chatGateway, usecaseOutBoundary, chatHistory and requestModel', () => {
            var { viewChatHistoryAsUserUseCase, 
                    dummyRequestModel, 
                    usecaseOutBoundary, 
                    placeholderUserId, 
                    dummyChatHistory }: { 
                        viewChatHistoryAsUserUseCase: ViewChatHistoryAsUserUseCase; 
                        dummyRequestModel: ViewChatHistoryAsUserRequestModel; 
                        usecaseOutBoundary: any; placeholderUserId: any; 
                        dummyChatHistory: any; } = this.setupAllDummies();

            it('should call usecaseOutBoundary.sendResultModel with a valid dummy response model', async () => {
                await viewChatHistoryAsUserUseCase.executeViewChatHistory(dummyRequestModel);
        
                expect(usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ViewChatHistoryAsUserResultModel(placeholderUserId, dummyChatHistory)
                );
            });

            describe('Given only non-empty chatHistory', () => {
                const useCase = this.setupUsecaseWithNonEmptyChatHistory(usecaseOutBoundary);

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

                    expect(usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
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