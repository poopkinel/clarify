// import '@types/jest';

import { CreateATestChatUseCase } from '../src/useCases/createATestChatUseCase';
import { ChatGatewaySqliteImpl } from '../src/details/persistence/chatGatewaySqliteImpl';

describe('CreateATestChatUseCase', () => {
    it('should return the chat id for a new created test chat', async () => {
        const chatGateway = new ChatGatewaySqliteImpl();
        const chatId = await chatGateway.createChat('testChat', 'user1', 'user2')

        expect(chatId).toBeDefined();
        expect(chatId).toEqual(expect.any(Number));
    });

    it('should return a valid chat entity for a chat id', async () => {
        const chatGateway = new ChatGatewaySqliteImpl();
        const chatId = await chatGateway.createChat('testChat', 'user1', 'user2')
        const chatEntity = await chatGateway.getChatById(chatId);

        expect(chatEntity).toBeDefined();
        expect(chatEntity).toHaveProperty('id');
        expect(chatEntity).toHaveProperty('name');
        expect(chatEntity).toHaveProperty('user1');
        expect(chatEntity).toHaveProperty('user2');
        expect(chatEntity).toHaveProperty('responses');
        expect(chatEntity).toHaveProperty('createdAt');
        expect(chatEntity).toHaveProperty('updatedAt');
    });
});