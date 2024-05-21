import CreateAChatAsUserToBeParticipantUseCase from '../../../src/useCases/current/createAChatAsUserToBeParticipantUseCase'
import ChatGatewayToCreateChatToBeParticipant from '../../../src/boundaries/gateways/chatGatewayToCreateChatToBeParticipant'
import UsecaseOutBoundary from '../../../src/boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateAChatAsUserToBeParticipantResultModel from '../../../src/dataModels/current/specific/createAChatAsUserToBeParticipantResultModel';

class CreateAChatAsUserToBeParticipantUseCaseTest {
    private usecaseOutBoundarySpy: UsecaseOutBoundary<CreateAChatAsUserToBeParticipantResultModel> = {
        sendResultModel: jest.fn()
    };
    
    setup() {
    }
    
    runTests() {
        describe('Given a use case created with dummy chat gateway', () => {
            const dummyOtherParticipantLink = "";
            const dummyViewerLink = "";

            const dummyChatEntity = {
                id: "",
                name: "",
                user1: "",
                user2: "",
                createSuccess: true,
                createError: "",
                sharingSettings: {
                    getLink: jest.fn().mockResolvedValue(dummyOtherParticipantLink)
                },
                getLink: jest.fn().mockResolvedValue(dummyOtherParticipantLink)
            }
        
            const chatGatewayDummy: ChatGatewayToCreateChatToBeParticipant = {
                createChatToBeParticipant: jest.fn().mockResolvedValue(dummyChatEntity)
            }
            const dummyUseCase = new CreateAChatAsUserToBeParticipantUseCase(chatGatewayDummy, this.usecaseOutBoundarySpy);

            it('use case should be defined', async () => {
                expect(dummyUseCase).toBeDefined();
            });
            
            describe('Given a dummy request model', () => {
                const dummyRequestModel = { 
                    userId: '',
                    chatName: ''
                }

                it('should call usecaseOutBoundary.sendResultModel', async () => {
                    await dummyUseCase.executeCreateChatToBeParticipant(dummyRequestModel);
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalled();
                });
                
                describe('Given dummy result values', () => {
                    const dummyCreatedChatId = "";
                    const dummySuccess = true;
                    const dummyError = '';
                    it('should call usecaseOutBoundary.sendResultModel with a CreateAChatAsUserToBeParticipantResultModel', async () => {
                        await dummyUseCase.executeCreateChatToBeParticipant(dummyRequestModel);

                        const dummyResultModel = new CreateAChatAsUserToBeParticipantResultModel(
                            dummyCreatedChatId, dummyOtherParticipantLink, dummyViewerLink, dummySuccess, dummyError);

                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(dummyResultModel);
                    });
                });                
            });
        });
        
        describe('Given a use case created with mock chat gateway', () => {
            const stubUserId: string = 'userId';
            const stubUser2Id: string = 'user2Id';
            const stubChatName: string = 'chatName';
            
            const stubSuccess = true;
            const stubFail = false;
            const stubSuccessNoError = '';
            const stubFailError = 'Error creating chat';

            const stubSuccessOtherParticipantLink: string = "/chat/createdChatId";
            const stubSuccessViewerLink: string = "/chat/createdChatId";
            const stubFailOtherParticipantLink: string = '';
            const stubFailViewerLink: string = '';

            const stubCreatedChatIdSuccess = 'createdChatId';
            const stubCreatedChatIdFail = '';

            const stubSuccessChatEntityForUserToBeParticipant = {
                id: stubCreatedChatIdSuccess,
                name: stubChatName,
                user1: stubUserId,
                user2: stubUser2Id,
                createSuccess: stubSuccess,
                createError: stubSuccessNoError,
                sharingSettings: {
                    getLink: jest.fn().mockResolvedValue(stubSuccessOtherParticipantLink)
                },
                getLink: jest.fn().mockResolvedValue(stubSuccessOtherParticipantLink)
            }
            
            const stubFailChatEntityForUserToBeParticipant = {
                id: stubCreatedChatIdFail,
                name: stubChatName,
                user1: stubUserId,
                user2: stubUser2Id,
                createSuccess: stubFail,
                createError: stubFailError,
                sharingSettings: {
                    getLink: jest.fn().mockResolvedValue(stubFailOtherParticipantLink)
                },
                getLink: jest.fn().mockResolvedValue(stubFailOtherParticipantLink)
            }
                
            var mockGatewayCreateSuccessToggle: boolean;

            const mockChatGateway: ChatGatewayToCreateChatToBeParticipant = {
                createChatToBeParticipant: jest.fn().mockImplementation((userId: string, chatName: string) => {
                    return mockGatewayCreateSuccessToggle 
                        ? stubSuccessChatEntityForUserToBeParticipant
                        : stubFailChatEntityForUserToBeParticipant;
                })
            }

            describe('Given a stub request model', () => {
                const stubRequestModel = {
                    userId: stubUserId,
                    chatName: stubChatName
                }

                const stubUseCase = new CreateAChatAsUserToBeParticipantUseCase(mockChatGateway, this.usecaseOutBoundarySpy);
                
                describe('Given a stub chatName and userId in request model', () => {
                    it('should call chatGateway.createChatToBeParticipant with chatName and userId', async () => {
                        await stubUseCase.executeCreateChatToBeParticipant(stubRequestModel);
                        expect(mockChatGateway.createChatToBeParticipant).toHaveBeenCalledWith(stubChatName, stubUserId);
                    });
                });
                

                describe('Given stub sharing links and stub created chat id', () => {                    
                    describe('Given successful chat creation', () => {
                        it('should have result model contain a result model with valid success data', async () => {                  
                            mockGatewayCreateSuccessToggle = true;
                            await stubUseCase.executeCreateChatToBeParticipant(stubRequestModel);
                            
                            expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                                new CreateAChatAsUserToBeParticipantResultModel(
                                    stubCreatedChatIdSuccess, 
                                    stubSuccessOtherParticipantLink, 
                                    stubSuccessViewerLink,
                                    stubSuccess,
                                    stubSuccessNoError
                                )
                            );
                        });
                    });
                    describe('Given unsuccessful chat creation', () => {
                        
                        it('should have result model contain a result model with valid error data', async () => {
                            mockGatewayCreateSuccessToggle = false;
                            await stubUseCase.executeCreateChatToBeParticipant(stubRequestModel);
                            
                            expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                                new CreateAChatAsUserToBeParticipantResultModel(
                                    stubCreatedChatIdFail,
                                    stubFailOtherParticipantLink,
                                    stubFailViewerLink,
                                    stubFail,
                                    stubFailError
                                )
                            );
                        });
                    });
                });
            });
        });
    }
}

const usecaseTest = new CreateAChatAsUserToBeParticipantUseCaseTest();
usecaseTest.setup();
usecaseTest.runTests();