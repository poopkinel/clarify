import ShareAChatAsUserRequestModel from '../src/dataModels/current/specific/shareAChatAsUserRequestModel'
import ShareAChatAsUserResultModel from '../src/dataModels/current/specific/shareAChatAsUserResultModel'
import ShareAChatAsUserUseCase from '../src/useCases/current/shareAChatAsUserUseCase'
import ChatGateway from '../src/boundaries/gateways/chatGateway'
import ChatGatewayMockImpl from '../src/details/persistence/current/chatGatewayMockImpl'
import { ResponseEntity, ResponseType } from '../src/entities/responseEntity'
import ChatSharingSettingsForSharingOptions from '../src/entities/chatSharingSettingsForSharingOptions'

// import "@types/jest";

const usecaseOutBoundary = {
    sendStartNewChatResult: jest.fn()
}

const mockSharingOptions: ChatSharingSettingsForSharingOptions = {
    getSharingOptions: jest.fn().mockReturnValue(["option1", "option2"])
}

const chatGatewayMockWithEmtpyData = {
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

const mockPlaceholderChatId = "chatId";
const mockPlaceholderUserId = "userId";

const mockPlaceholderResultModel = new ShareAChatAsUserResultModel(
    mockPlaceholderChatId,
    mockPlaceholderUserId,
    [],
    "all",
    "error",
    []
);

const mockPlaceholderResultModelKeyValueWithEmptyResponses = {
    chatId: mockPlaceholderChatId,
    userId: mockPlaceholderUserId,
    responses: [],
    access: "all",
    error: "error",
    sharingOptions: []
}

const setupEmptyDataUseCase = () => {
    return new ShareAChatAsUserUseCase(usecaseOutBoundary, chatGatewayMockWithEmtpyData)
}

const setupMockRequest = () => {
    return new ShareAChatAsUserRequestModel(mockPlaceholderChatId, mockPlaceholderUserId);
}

const emptyDataShareAChatAsUserUseCase = setupEmptyDataUseCase();
const emptyDataMockRequest = setupMockRequest();

const mockResponseText = "test text";
const mockOnStateId = "Test state";

const setupMockGateway = (responses: ResponseEntity[], options: string[]) => {
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

const mockOptions = ["option1", "option2"];

describe('ShareAChatAsUserUseCase', () => {

    it('should call sendStartNewChatResult on usecaseOutBoundary', async () => {
        await emptyDataShareAChatAsUserUseCase.shareAChatAsUser(emptyDataMockRequest);
        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalled();
    });
    it('should call sendStartNewChatResult on usecaseOutBoundary with a result model', async () => {
        await emptyDataShareAChatAsUserUseCase.shareAChatAsUser(emptyDataMockRequest);
        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(mockPlaceholderResultModel);
    });

    it('should call getChatById on chatGateway with chatId from requestModel', async () => {
        await emptyDataShareAChatAsUserUseCase.shareAChatAsUser(emptyDataMockRequest);
        expect(chatGatewayMockWithEmtpyData.getChatById).toHaveBeenCalledWith(mockPlaceholderChatId);
    });

    it('should map empty responseEntities to empty responses', async () => {
        const request = new ShareAChatAsUserRequestModel(mockPlaceholderChatId, mockPlaceholderUserId);
        await emptyDataShareAChatAsUserUseCase.shareAChatAsUser(request);

        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(mockPlaceholderResultModelKeyValueWithEmptyResponses);
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

        const chatGatewayWithSingleResponse: ChatGateway = setupMockGateway(mockResponses, []);
        const singleResponseUseCase = new ShareAChatAsUserUseCase(usecaseOutBoundary, chatGatewayWithSingleResponse)
        
        await singleResponseUseCase.shareAChatAsUser(emptyDataMockRequest);

        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
            mockPlaceholderChatId,
            mockPlaceholderUserId,
            [{ text: mockResponseText, onStateId: mockOnStateId}],
            "all",
            "error",
            []
        ));
    });

    it('should return the sharing options from the chatGateway', async () => {
        const chatGatewayWithOptions: ChatGateway = setupMockGateway([], mockOptions);

        const shareAChatAsUserUseCase = new ShareAChatAsUserUseCase(usecaseOutBoundary, chatGatewayWithOptions)
        const request = new ShareAChatAsUserRequestModel(mockPlaceholderChatId, mockPlaceholderUserId);
        await shareAChatAsUserUseCase.shareAChatAsUser(request);

        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalled();
        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
            mockPlaceholderChatId,
            mockPlaceholderUserId,
            [],
            "all",
            "error",
            await mockSharingOptions.getSharingOptions()
        ));
    });
})