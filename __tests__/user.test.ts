import ShareAChatAsUserRequestModel from '../src/dataModels/current/specific/shareAChatAsUserRequestModel'
import ShareAChatAsUserResultModel from '../src/dataModels/current/specific/shareAChatAsUserResultModel'
import ShareAChatAsUserUseCase from '../src/useCases/current/shareAChatAsUserUseCase'
import ChatGateway from '../src/boundaries/gateways/chatGateway'
import ChatGatewayMockImpl from '../src/details/persistence/current/chatGatewayMockImpl'
import { ResponseEntity, ResponseType } from '../src/entities/responseEntity'

const usecaseOutBoundary = {
    sendStartNewChatResult: jest.fn()
}

const chatGatewayMockWithEmtpyResponses = {
    createChat: jest.fn(),
    getAllChats: jest.fn(),
    deleteChat: jest.fn(),
    getChatById: jest.fn().mockResolvedValue({
        responses: []
    })
}

const mockPlaceholderChatId = "chatId";
const mockPlaceholderUserId = "userId";

const mockPlaceholderResultModel = new ShareAChatAsUserResultModel(
    mockPlaceholderChatId,
    mockPlaceholderUserId,
    [],
    "all",
    "error"
);

const mockPlaceholderResultModelKeyValueWithEmptyResponses = {
    chatId: mockPlaceholderChatId,
    userId: mockPlaceholderUserId,
    responses: [],
    access: "all",
    error: "error"
}

describe('ShareAChatAsUserUseCase', () => {
    it('should call sendStartNewChatResult on usecaseOutBoundary with result', async () => {
        const shareAChatAsUserUseCase = new ShareAChatAsUserUseCase(usecaseOutBoundary, chatGatewayMockWithEmtpyResponses)
        const request = new ShareAChatAsUserRequestModel(mockPlaceholderChatId, mockPlaceholderUserId);
        await shareAChatAsUserUseCase.shareAChatAsUser(request);

        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalled();
        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(mockPlaceholderResultModel);
    });

    it('should call getChatById on chatGateway with chatId from requestModel', async () => {
        const shareAChatAsUserUseCase = new ShareAChatAsUserUseCase(usecaseOutBoundary, chatGatewayMockWithEmtpyResponses)
        const request = new ShareAChatAsUserRequestModel(mockPlaceholderChatId, mockPlaceholderUserId);
        await shareAChatAsUserUseCase.shareAChatAsUser(request);

        expect(chatGatewayMockWithEmtpyResponses.getChatById).toHaveBeenCalled();
        expect(chatGatewayMockWithEmtpyResponses.getChatById).toHaveBeenCalledWith(mockPlaceholderChatId);
    });

    it('should map empty responseEntities to empty responses', async () => {
        const chatGateway: ChatGateway = new ChatGatewayMockImpl();
        const shareAChatAsUserUseCase = new ShareAChatAsUserUseCase(usecaseOutBoundary, chatGateway)
        const request = new ShareAChatAsUserRequestModel(mockPlaceholderChatId, mockPlaceholderUserId);
        await shareAChatAsUserUseCase.shareAChatAsUser(request);

        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalled();
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

        const chatGateway: ChatGateway = {
            createChat: jest.fn(),
            getAllChats: jest.fn(),
            deleteChat: jest.fn(),
            getChatById: jest.fn().mockResolvedValue({
                responses: mockResponses
            })
        }

        const shareAChatAsUserUseCase = new ShareAChatAsUserUseCase(usecaseOutBoundary, chatGateway)
        const request = new ShareAChatAsUserRequestModel(mockPlaceholderChatId, mockPlaceholderUserId);
        await shareAChatAsUserUseCase.shareAChatAsUser(request);

        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalled();
        expect(usecaseOutBoundary.sendStartNewChatResult).toHaveBeenCalledWith(new ShareAChatAsUserResultModel(
            mockPlaceholderChatId,
            mockPlaceholderUserId,
            [{ text: "test text", onStateId: "Test state"}],
            "all",
            "error"
        ));
    });
})