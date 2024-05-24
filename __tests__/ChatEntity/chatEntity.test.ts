// A test suite for the chat entity

import { ChatEntity } from '../../src/entities/chatEntity/chatEntity';
import ChatSharingSettings from '../../src/entities/chatSharingSetting';

describe('ChatEntity', () => {
    it('should create a new chat entity', () => {
        const chatEntity = new ChatEntity('1', 'Test Chat', 'user1', 'user2', true);
        expect(chatEntity.id).toBe('1');
        expect(chatEntity.name).toBe('Test Chat');
        expect(chatEntity.participator1UserId).toBe('user1');
        expect(chatEntity.participator2UserId).toBe('user2');
        expect(chatEntity.responses).toBeDefined();
        expect(chatEntity.createdAt).toBeDefined();
        expect(chatEntity.updatedAt).toBeDefined();
        expect(chatEntity.sharingSettings).toBeDefined();
    });

    it('should create a new chat entity with valid sharing settings', async () => {
        const chatEntity = new ChatEntity('1', 'Test Chat', 'user1', 'user2', true);
        expect(chatEntity.sharingSettings).toBeDefined();
        expect(chatEntity.sharingSettings.chatId).toBe('1');
        const link = await chatEntity.sharingSettings.getLink();
        expect(link).toBeDefined();
        expect(chatEntity.ValidateLink(link)).toBe(true);
    });
});