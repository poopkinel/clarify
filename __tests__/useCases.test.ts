// import '@types/jest';

import { CreateATestChatUseCase } from '../src/useCases/createATestChatUseCase';
import { ChatGatewayMockImpl } from '../src/details/persistence/chatGatewayMockImpl';

describe('CreateATestChatUseCase', () => {
    it('should create a test chat', async () => {
        const chatGateway = new ChatGatewayMockImpl();
        const createATestChatUseCase = new CreateATestChatUseCase(chatGateway);
        const chatId = await createATestChatUseCase.execute('testChat', 'user1', 'user2');

        expect(chatId).toBeDefined();
        expect(chatId).toBe('mockChatId');
    });
});