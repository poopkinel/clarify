import CreateAChatAsUserToBeParticipatorUseCase from '../../../src/useCases/current/createAChatAsUserToBeParticipatorUseCase'
import ChatGatewayToCreateChatToBeParticipator from '../../../src/boundaries/gateways/chatGatewayToCreateChatToBeParticipator'
import UsecaseOutBoundary from '../../../src/boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateAChatAsUserToBeParticipatorResultModel from '../../../src/dataModels/current/specific/createAChatAsUserToBeParticipatorResultModel';

class CreateAChatAsUserToBeParticipatorUseCaseTest {
    private usecaseOutBoundarySpy: UsecaseOutBoundary<CreateAChatAsUserToBeParticipatorResultModel> = {
        sendResultModel: jest.fn()
    };
    
    setup() {
    }
    
    runTests() {
        describe('Given a use case created with dummy chat gateway', () => {
            const dummyOtherParticipatorLink = "";
            const dummyViewerLink = "";

            const dummyChatEntity = {
                id: "",
                name: "",
                creatorUserId: "",
                user2: "",
                createSuccess: true,
                createError: "",
                sharingSettings: {
                    getLink: jest.fn().mockResolvedValue(dummyOtherParticipatorLink)
                },
                getLink: jest.fn().mockResolvedValue(dummyOtherParticipatorLink)
            }
        
            const chatGatewayDummy: ChatGatewayToCreateChatToBeParticipator = {
                createChatToBeParticipator: jest.fn().mockResolvedValue(dummyChatEntity)
            }
            const dummyUseCase = new CreateAChatAsUserToBeParticipatorUseCase(chatGatewayDummy, this.usecaseOutBoundarySpy);

            it('use case should be defined', async () => {
                expect(dummyUseCase).toBeDefined();
            });
            
            describe('Given a dummy request model', () => {
                const dummyUserId = ''
                const dummyRequestModel = { 
                    userId: dummyUserId,
                    chatName: ''
                }

                it('should call usecaseOutBoundary.sendResultModel', async () => {
                    await dummyUseCase.executeCreateChatToBeParticipator(dummyRequestModel);
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalled();
                });
                
                describe('Given dummy result values', () => {
                    const dummyCreatedChatId = "";
                    const dummySuccess = true;
                    const dummyError = '';
                    it('should call usecaseOutBoundary.sendResultModel with a CreateAChatAsUserToBeParticipatorResultModel', async () => {
                        await dummyUseCase.executeCreateChatToBeParticipator(dummyRequestModel);

                        const dummyResultModel = new CreateAChatAsUserToBeParticipatorResultModel(
                            dummyUserId, dummySuccess, dummyCreatedChatId, dummyOtherParticipatorLink, dummyViewerLink, dummyError);

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

            const stubSuccessOtherParticipatorLink: string = "/chat/createdChatId";
            const stubSuccessViewerLink: string = "/chat/createdChatId";
            const stubFailOtherParticipatorLink: string = '';
            const stubFailViewerLink: string = '';

            const stubCreatedChatIdSuccess = 'createdChatId';
            const stubCreatedChatIdFail = '';

            const stubSuccessChatEntity = setupStubSuccessChatEntityForUserToBeParticipator()
            const stubFailChatEntity = setupSubFailChatEntityForUserToBeParticipator()
                
            var mockGatewayCreateSuccessToggle: boolean;

            const mockChatGateway: ChatGatewayToCreateChatToBeParticipator = {
                createChatToBeParticipator: jest.fn().mockImplementation((userId: string, chatName: string) => {
                    return mockGatewayCreateSuccessToggle 
                        ? stubSuccessChatEntity
                        : stubFailChatEntity;
                })
            }

            describe('Given a stub request model', () => {
                const stubRequestModel = {
                    userId: stubUserId,
                    chatName: stubChatName
                }

                const stubUseCase = new CreateAChatAsUserToBeParticipatorUseCase(mockChatGateway, this.usecaseOutBoundarySpy);
                
                describe('Given a stub chatName and userId in request model', () => {
                    it('should call chatGateway.createChatToBeParticipator with chatName and userId', async () => {
                        await stubUseCase.executeCreateChatToBeParticipator(stubRequestModel);
                        expect(mockChatGateway.createChatToBeParticipator).toHaveBeenCalledWith(stubChatName, stubUserId);
                    });
                });
                

                describe('Given stub sharing links and stub created chat id', () => {                    
                    describe('Given successful chat creation', () => {
                        it('should have result model contain a result model with valid success data', async () => {                  
                            mockGatewayCreateSuccessToggle = true;
                            await stubUseCase.executeCreateChatToBeParticipator(stubRequestModel);
                            
                            expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                                new CreateAChatAsUserToBeParticipatorResultModel(
                                    stubUserId,
                                    stubSuccess,
                                    stubCreatedChatIdSuccess, 
                                    stubSuccessOtherParticipatorLink, 
                                    stubSuccessViewerLink,
                                    stubSuccessNoError
                                )
                            );
                        });
                    });
                    describe('Given unsuccessful chat creation', () => {
                        
                        it('should have result model contain a result model with valid error data', async () => {
                            mockGatewayCreateSuccessToggle = false;
                            await stubUseCase.executeCreateChatToBeParticipator(stubRequestModel);
                            
                            expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                                new CreateAChatAsUserToBeParticipatorResultModel(
                                    stubUserId,
                                    stubFail,
                                    stubCreatedChatIdFail,
                                    stubFailOtherParticipatorLink,
                                    stubFailViewerLink,
                                    stubFailError
                                )
                            );
                        });
                    });
                });
            });

            function setupSubFailChatEntityForUserToBeParticipator() {
                return {
                    id: stubCreatedChatIdFail,
                    name: stubChatName,
                    creatorUserId: stubUserId,
                    user2: stubUser2Id,
                    createSuccess: stubFail,
                    createError: stubFailError,
                    sharingSettings: {
                        getLink: jest.fn().mockResolvedValue(stubFailOtherParticipatorLink)
                    },
                    getLink: jest.fn().mockResolvedValue(stubFailOtherParticipatorLink)
                };
            }

            function setupStubSuccessChatEntityForUserToBeParticipator() {
                return {
                    id: stubCreatedChatIdSuccess,
                    name: stubChatName,
                    creatorUserId: stubUserId,
                    user2: stubUser2Id,
                    createSuccess: stubSuccess,
                    createError: stubSuccessNoError,
                    sharingSettings: {
                        getLink: jest.fn().mockResolvedValue(stubSuccessOtherParticipatorLink)
                    },
                    getLink: jest.fn().mockResolvedValue(stubSuccessOtherParticipatorLink)
                };
            }
        });
    }
}

const usecaseTest = new CreateAChatAsUserToBeParticipatorUseCaseTest();
usecaseTest.setup();
usecaseTest.runTests();