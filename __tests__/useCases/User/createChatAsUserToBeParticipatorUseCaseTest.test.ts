import CreateChatAsUserToBeParticipatorUseCase from '../../../src/useCases/current/createChatAsUserToBeParticipatorUseCase'
import ChatGatewayToCreateChatToBeParticipator from '../../../src/boundaries/gateways/chatGatewayToCreateChatToBeParticipator'
import UsecaseOutBoundary from '../../../src/boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateChatAsUserToBeParticipatorResultModel from '../../../src/dataModels/current/specific/createChatAsUserToBeParticipatorResultModel';

class CreateChatAsUserToBeParticipatorUseCaseTest {
    private usecaseOutBoundarySpy: UsecaseOutBoundary<CreateChatAsUserToBeParticipatorResultModel> = {
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
            const dummyUseCase = new CreateChatAsUserToBeParticipatorUseCase(chatGatewayDummy, this.usecaseOutBoundarySpy);

            it('use case should be defined', async () => {
                expect(dummyUseCase).toBeDefined();
            });
            
            describe('Given a dummy request model', () => {
                const dummyUserId = ''
                const dummyRequestModel = { 
                    userId: dummyUserId,
                    chatName: '',
                    flowId: ''
                }

                it('should call usecaseOutBoundary.sendResultModel', async () => {
                    await dummyUseCase.executeCreateChatToBeParticipator(dummyRequestModel);
                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalled();
                });
                
                describe('Given dummy result values', () => {
                    const dummyCreatedChatId = "";
                    const dummySuccess = true;
                    const dummyError = '';
                    it('should call usecaseOutBoundary.sendResultModel with a CreateChatAsUserToBeParticipatorResultModel', async () => {
                        await dummyUseCase.executeCreateChatToBeParticipator(dummyRequestModel);

                        const dummyResultModel = new CreateChatAsUserToBeParticipatorResultModel(
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
            const stubFlowId: string = 'flowId';

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
                    chatName: stubChatName,
                    flowId: stubFlowId
                }

                const stubUseCase = new CreateChatAsUserToBeParticipatorUseCase(mockChatGateway, this.usecaseOutBoundarySpy);
                
                describe('Given a stub chatName and userId in request model', () => {
                    it('should call chatGateway.createChatToBeParticipator with chatName and userId', async () => {
                        await stubUseCase.executeCreateChatToBeParticipator(stubRequestModel);
                        expect(mockChatGateway.createChatToBeParticipator).toHaveBeenCalledWith(stubChatName, stubUserId, stubFlowId);
                    });
                });
                

                describe('Given stub sharing links and stub created chat id', () => {                    
                    describe('Given successful chat creation', () => {
                        it('should have result model contain a result model with valid success data', async () => {                  
                            mockGatewayCreateSuccessToggle = true;
                            await stubUseCase.executeCreateChatToBeParticipator(stubRequestModel);
                            
                            expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                                new CreateChatAsUserToBeParticipatorResultModel(
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
                                new CreateChatAsUserToBeParticipatorResultModel(
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

const usecaseTest = new CreateChatAsUserToBeParticipatorUseCaseTest();
usecaseTest.setup();
usecaseTest.runTests();