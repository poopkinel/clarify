import ChatGatewayToViewChatHistory from "../../../src/boundaries/gateways/chatGatewayToViewChatHistory";
import ViewChatHistoryAsUserUseCase from "../../../src/useCases/current/viewChatHistoryAsUserUseCase";
import ViewChatHistoryAsUserResultModel from "../../../src/dataModels/current/specific/viewChatHistoryAsUserResultModel";
import ViewChatHistoryAsUserRequestModel from "../../../src/dataModels/current/specific/viewChatHistoryAsUserRequestModel";
import { ResponseType } from "../../../src/entities/responseEntity";

class ViewChatHistoryAsUserTest {
    private usecaseOutBoundarySpy: any = {
        sendResultModel: jest.fn()
    };

    runTests() {
        describe('Given a dummy usecaseOutBoundary, chatHistory, chatGateway and requestModel', () => {
            const usecaseOutBoundarySpy = {
                sendResultModel: jest.fn()
            }
            
            const dummyChatHistory: any = [];
            
            const dummychatGateway: ChatGatewayToViewChatHistory = {
                getChatHistoryById: jest.fn().mockResolvedValue(dummyChatHistory)
            };
            
            const useCase = new ViewChatHistoryAsUserUseCase(usecaseOutBoundarySpy, dummychatGateway);
            
            const dummyUserId: any = "";
            const dummyChatId: any = "";
            
            const dummyRequestModel = new ViewChatHistoryAsUserRequestModel(dummyChatId, dummyUserId);
            it('should call usecaseOutBoundary.sendResultModel with a valid dummy result model', async () => {
                await useCase.executeViewChatHistory(dummyRequestModel);
        
                expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                    new ViewChatHistoryAsUserResultModel(dummyUserId, dummyChatHistory)
                );
            });

            describe('Given an expected chat history of single chat, ', () => {
                const stubChatHistorySingleChatResult = [{
                    chatId: "chatId",
                    participator1UserId: "user1",
                    participator2UserId: "user2",
                    responses: [{
                        text: "text",
                        responseId: "responseId",
                        responseType: "text"
                    }]
                }];

                describe('Given a chatHistory stub chatGateway and a stub usecase', () => {
                    const stubChatHistory: any = [
                        {
                            id: "chatId",
                            participator1UserId: "user1",
                            participator2UserId: "user2",
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

                    const useCaseWithStubGateway = new ViewChatHistoryAsUserUseCase(usecaseOutBoundarySpy, chatGatewayStubHistory);

                    it('should call usecaseOutBoundary.sendResultModel with a response model containing chat history', async () => {
                        await useCaseWithStubGateway.executeViewChatHistory(dummyRequestModel);
                        
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                            new ViewChatHistoryAsUserResultModel(
                                dummyUserId,
                                stubChatHistorySingleChatResult
                            )
                        );
                    });
                    
                    // it.skip('should get from gateway.getChatHistoryById a ChatEntityForViewingChatHistory type', async () => {                      
                    //     await useCaseWithStubGateway.executeViewChatHistory(dummyRequestModel);
                    // });
                });


                describe('Given a different user id', () => {
                    it('should call usecaseOutBoundary.sendResultModel with a different user id', async () => {
                        const dummyRequestModel = new ViewChatHistoryAsUserRequestModel("chatId", "differentUserId");
                        await useCase.executeViewChatHistory(dummyRequestModel);
                
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
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
                        const mockChatGatewayChatHistory: ChatGatewayToViewChatHistory = {
                            getChatHistoryById: jest.fn().mockResolvedValue(counter == 0 ? [] : this.setupStubChatHistory())
                        };
                        const useCase = new ViewChatHistoryAsUserUseCase(usecaseOutBoundarySpy, mockChatGatewayChatHistory);
                        await useCase.executeViewChatHistory(dummyRequestModel);
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                            new ViewChatHistoryAsUserResultModel(
                                dummyUserId,
                                []
                            )
                        );

                        counter++;
                        await useCase.executeViewChatHistory(dummyRequestModel);

                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                            new ViewChatHistoryAsUserResultModel(
                                dummyUserId,
                                stubChatHistorySingleChatResult
                            )
                        );
                    });
                });

                describe('Given a chat history with multiple chats', () => {
                    const stubFirstChatId = "chatId1";
                    const stubSecondChatId = "chatId2";
                    const stubFirstUserIdFirstChat = "user1";
                    const stubFirstUserIdSecondChat = "user3";
                    const stubSecondUserIdFirstChat = "user2";
                    const stubSecondUserIdSecondChat = "user4";
                    const stubTextFirstChat = "textFirstChat";
                    const stubTextSecondChat = "textSecondChat";
                    const stubResponseIdFirstChat = "responseId1";
                    const stubResponseIdSecondChat = "responseId1";
                    const subReponseTypeFirstChat = ResponseType.TEXT;
                    const subReponseTypeSecondChat = ResponseType.MULTI_CHOICE;

                    const stubChatHistoryMultipleChats = [
                        {
                            id: stubFirstChatId,
                            participator1UserId: stubFirstUserIdFirstChat,
                            participator2UserId: stubSecondUserIdFirstChat,
                            responses: [{
                                text: stubTextFirstChat,
                                id: stubResponseIdFirstChat,
                                type: subReponseTypeFirstChat
                            }]
                        },
                        {
                            id: stubSecondChatId,
                            participator1UserId: stubFirstUserIdSecondChat,
                            participator2UserId: stubSecondUserIdSecondChat,
                            responses: [{
                                text: stubTextSecondChat,
                                id: stubResponseIdSecondChat,
                                type: subReponseTypeSecondChat
                            }]
                        }
                    ];
                    it('should call usecaseOutBoundary.sendResultModel with a response model containing multiple chats', async () => {
                        const chatGatewayStubHistoryMultipleChats: ChatGatewayToViewChatHistory = {
                            getChatHistoryById: jest.fn().mockResolvedValue(stubChatHistoryMultipleChats)
                        };
                        const useCaseWithStubGatewayMultipleChats = new ViewChatHistoryAsUserUseCase(usecaseOutBoundarySpy, chatGatewayStubHistoryMultipleChats);
                        await useCaseWithStubGatewayMultipleChats.executeViewChatHistory(dummyRequestModel);
                        
                        expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                            new ViewChatHistoryAsUserResultModel(
                                dummyUserId,
                                [
                                    {
                                        chatId: stubFirstChatId,
                                        participator1UserId: stubFirstUserIdFirstChat,
                                        participator2UserId: stubSecondUserIdFirstChat,
                                        responses: [
                                            {
                                                text: stubTextFirstChat,
                                                responseId: stubResponseIdFirstChat,
                                                responseType: subReponseTypeFirstChat
                                            }
                                        ]
                                    },
                                    {
                                        chatId: stubSecondChatId,
                                        participator1UserId: stubFirstUserIdSecondChat,
                                        participator2UserId: stubSecondUserIdSecondChat,
                                        responses: [
                                            {
                                                text: stubTextSecondChat,
                                                responseId: stubResponseIdSecondChat,
                                                responseType: subReponseTypeSecondChat
                                            }
                                        ]
                                    }
                                ]
                            )
                        );
                    });
                });
            });
        });

    }

    setup() {
    }
    
    setupAllDummies() {
        const dummyUserId: any = "userId";
        const dummyChatId: any = "chatId";
        const dummyChatHistory: any = [];
        const dummychatGateway: ChatGatewayToViewChatHistory = {
            getChatHistoryById: jest.fn().mockResolvedValue(dummyChatHistory)
        };
        
        const useCase = new ViewChatHistoryAsUserUseCase(this.usecaseOutBoundarySpy, dummychatGateway);
        const dummyRequestModel = new ViewChatHistoryAsUserRequestModel(dummyChatId, dummyUserId);
        return { useCase, dummyRequestModel, dummyUserId, dummyChatHistory };
    }

    setupStubChatGateway() {
        return {
            getChatHistoryById: jest.fn().mockResolvedValue(this.setupStubChatHistory())
        };
    }
    
    setupStubChatHistory() {
        return [
            {
                id: "chatId",
                participator1UserId: "user1",
                participator2UserId: "user2",
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
    
        const useCase = new ViewChatHistoryAsUserUseCase(this.usecaseOutBoundarySpy, chatGatewayStubHistory);
        return useCase;
    }
}

const test = new ViewChatHistoryAsUserTest();
test.setup();
test.runTests();