import ShareAChatAsUserRequestModel from '../src/dataModels/current/specific/shareAChatAsUserRequestModel'
import ShareAChatAsUserResultModel from '../src/dataModels/current/specific/shareAChatAsUserResultModel'
import ShareAChatAsUserUseCase from '../src/useCases/current/shareAChatAsUserUseCase'

describe('ShareAChatAsUserUseCase', () => {
    it('should get a valid response from usecaseOutBoundary.sendStartNewChatRequest', async () => {
        const usecaseInBoundary = {
            sendStartNewChatRequest: jest.fn()
        }
        const usecaseOutBoundary = {
            sendStartNewChatRequest: jest.fn()
        }
        const shareAChatAsUserUseCase = new ShareAChatAsUserUseCase(usecaseInBoundary, usecaseOutBoundary)
        const request = new ShareAChatAsUserRequestModel("chatId", "userId");
        const result = new ShareAChatAsUserResultModel("chatId", "userId", "all", "error");
        await shareAChatAsUserUseCase.shareAChatAsUser(request);

        expect(usecaseOutBoundary.sendStartNewChatRequest).toHaveBeenCalled();
        expect(usecaseOutBoundary.sendStartNewChatRequest).toHaveBeenCalledWith(result);
    });
})