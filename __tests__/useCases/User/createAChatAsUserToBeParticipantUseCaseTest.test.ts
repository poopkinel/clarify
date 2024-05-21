import CreateAChatAsUserToBeParticipantUseCase from '../../../src/useCases/current/createAChatAsUserToBeParticipantUseCase'
import ChatGatewayToCreateChatToBeParticipant from '../../../src/boundaries/gateways/chatGatewayToCreateChatToBeParticipant'
import UsecaseOutBoundary from '../../../src/boundaries/useCaseBoundaries/usecaseOutBoundary';
import CreateAChatAsUserToBeParticipantRequestModel from '../../../src/dataModels/current/specific/createAChatAsUserToBeParticipantRequestModel';
import CreateAChatAsUserToBeParticipantResultModel from '../../../src/dataModels/current/specific/createAChatAsUserToBeParticipantResultModel';
import { ChatEntity } from '../../../src/entities/chatEntity/chatEntity';
import ChatSharingSetting from '../../../src/entities/chatSharingSetting';
import ChatEntityForUserToBeParticipant from '../../../src/entities/chatEntity/chatEntityForUserToBeParticipant';
import ChatSharingLinkProvider from '../../../src/entities/chatEntity/chatSharer';

class CreateAChatAsUserToBeParticipantUseCaseTest {
    private usecaseOutBoundarySpy: UsecaseOutBoundary<CreateAChatAsUserToBeParticipantResultModel> = {
        sendResultModel: jest.fn()
    };
    
    setup() {
    }
    
    runTests() {
        describe('Given a use case created with dummy chat gateway', () => {
            const dummyCreatedChatId = "";
            const dummyOtherParticipantLink = "";
            const dummyViewerLink = "";

            const dummyChatEntity = {
                id: "",
                name: "",
                user1: "",
                user2: "",
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

                it('should call usecaseOutBoundary.sendResultModel with a CreateAChatAsUserToBeParticipantResultModel', async () => {
                    await dummyUseCase.executeCreateChatToBeParticipant(dummyRequestModel);

                    const dummyResultModel = new CreateAChatAsUserToBeParticipantResultModel(
                        dummyCreatedChatId, dummyOtherParticipantLink, dummyViewerLink);

                    expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(dummyResultModel);
                });
            
                
            });
        });
        
        describe('Given a use case created with stub chat gateway', () => {
            const stubCreatedChatId = 'createdChatId';
            const stubUserId: string = 'userId';
            const stubUser2Id: string = 'user2Id';
            const stubChatName: string = 'chatName';
            const stubChatEntityForUserToBeParticipant = new ChatEntity(
                stubCreatedChatId, stubChatName, stubUserId, stubUser2Id) as ChatEntityForUserToBeParticipant;
            
            const chatGatewayStub: ChatGatewayToCreateChatToBeParticipant = {
                createChatToBeParticipant: jest.fn().mockResolvedValue(
                    stubChatEntityForUserToBeParticipant
                )
            }

            describe('Given a stub request model', () => {
                const stubRequestModel = {
                    userId: stubUserId,
                    chatName: stubChatName
                }

                const stubUseCase = new CreateAChatAsUserToBeParticipantUseCase(chatGatewayStub, this.usecaseOutBoundarySpy);

                describe('Given a stub chatId and userId in request model', () => {
                    it('should call chatGateway.createChatToBeParticipant with chatName and userId', async () => {
                        await stubUseCase.executeCreateChatToBeParticipant(stubRequestModel);
                        expect(chatGatewayStub.createChatToBeParticipant).toHaveBeenCalledWith(stubChatName, stubUserId);
                    });
                });

                describe('Given stub sharing links and stub created chat id', () => {
                    it('should have result model contain the new chat id from the gateway and participant + viewer sharing links', async () => {
                        const stubOtherParticipantLink: string = "/chat/createdChatId";
                        const stubViewerLink: string = "/chat/createdChatId";
                        const createdChatIdStub = 'createdChatId';
                        
                        await stubUseCase.executeCreateChatToBeParticipant(stubRequestModel);

                        expect(this.usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith(
                            new CreateAChatAsUserToBeParticipantResultModel(createdChatIdStub, 
                                stubOtherParticipantLink, 
                                stubViewerLink)
                        );
                    });
                });
            });
        });
    }
}

const usecaseTest = new CreateAChatAsUserToBeParticipantUseCaseTest();
usecaseTest.setup();
usecaseTest.runTests();