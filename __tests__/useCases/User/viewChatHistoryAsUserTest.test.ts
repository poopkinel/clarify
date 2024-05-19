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

    setupStubChatGateway() {
        return {
            getChatHistoryById: jest.fn().mockResolvedValue([this.setupStubChatHistory])
        };
    }
    
    setupStubChatHistory() {
        return [
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
    }

    setupUsecaseWithNonEmptyStubChatHistory() {
        const stubChatHistory: any = this.setupStubChatHistory();
        const chatGatewayStubHistory: ChatGatewayToViewChatHistory = {
            getChatHistoryById: jest.fn().mockResolvedValue(stubChatHistory)
        };
    
        const useCase = new ViewChatHistoryAsUserUseCase(this.usecaseOutBoundary, chatGatewayStubHistory);
        return useCase;
    }

    

    runTests() {
        describe('Given a dummy chatGateway, usecaseOutBoundary, chatHistory and requestModel', () => {
            var { useCase,
                    dummyRequestModel, 
                    placeholderUserId, 
                    dummyChatHistory }: { 
                        useCase: ViewChatHistoryAsUserUseCase; 
                        placeholderUserId: any;
                        dummyRequestModel: ViewChatHistoryAsUserRequestModel; 
                        dummyChatHistory: any; } = this.setupAllDummies();

            it('should call usecaseOutBoundary.sendResultModel with a valid dummy response model', async () => {
                await useCase.executeViewChatHistory(dummyRequestModel);
        
                expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                    new ViewChatHistoryAsUserResultModel(placeholderUserId, dummyChatHistory)
                );
            });

            const expectedChatHistorySingleChatDummy = [{
                chatId: "chatId",
                user1: "user1",
                user2: "user2",
                responses: [{
                    text: "text",
                    responseId: "responseId",
                    responseType: "text"
                }]
            }];

            describe('Given only non-empty chatHistory', () => {
                const useCaseWithNonEmptyHistory = this.setupUsecaseWithNonEmptyStubChatHistory();

                it('should call usecaseOutBoundary.sendResultModel with a response model containing chat history', async () => {
                    await useCaseWithNonEmptyHistory.executeViewChatHistory(dummyRequestModel);
                    expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                        new ViewChatHistoryAsUserResultModel(
                            placeholderUserId,
                            expectedChatHistorySingleChatDummy
                        )
                    );
                });
            });


            describe('Given a different user id', () => {
                it('should call usecaseOutBoundary.sendResultModel with a different user id', async () => {
                    const dummyRequestModel = new ViewChatHistoryAsUserRequestModel("chatId", "differentUserId");
                    await useCase.executeViewChatHistory(dummyRequestModel);
            
                    expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                        new ViewChatHistoryAsUserResultModel(
                            "differentUserId",
                            []
                        )
                    );
                });
            });

            describe('Given an empty chat history', () => {
                it('When new chat is added to history, then chat history should include that chat in result model', async () => {
                    var counter = 0;
                    const chatGatewayFakeChatHistory: ChatGatewayToViewChatHistory = {
                        getChatHistoryById: jest.fn().mockResolvedValue(counter == 0 ? [] : this.setupStubChatHistory())
                    };
                    const useCase = new ViewChatHistoryAsUserUseCase(this.usecaseOutBoundary, chatGatewayFakeChatHistory);
                    await useCase.executeViewChatHistory(dummyRequestModel);
                    expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                        new ViewChatHistoryAsUserResultModel(
                            placeholderUserId,
                            []
                        )
                    );

                    counter++;
                    await useCase.executeViewChatHistory(dummyRequestModel);

                    expect(this.usecaseOutBoundary.sendResultModel).toHaveBeenCalledWith(
                        new ViewChatHistoryAsUserResultModel(
                            placeholderUserId,
                            expectedChatHistorySingleChatDummy
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