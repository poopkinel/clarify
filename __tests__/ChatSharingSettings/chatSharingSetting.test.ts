import ChatSharingSettings from '../../src/entities/chatSharingSetting';

const mockChatId1 = '1';
const mockChatId2 = '2';
const mockEmptyUserIdsWhiteList: string() = ();
const defaultSharingSettings = new ChatSharingSettings(mockChatId1, mockEmptyUserIdsWhiteList);

const linkFormat = /chat\/\d+/;

describe('ChatSharingSettings', () => {
    it('should create a new chat sharing settings entity', async () => {
        expect(defaultSharingSettings.chatId).toBe(mockChatId1);
        expect(await defaultSharingSettings.getLink()).toBeDefined();
    });

    it('should generate a different link for a different chat', async () => {
        const chatSharingSettings1 = new ChatSharingSettings(mockChatId1, mockEmptyUserIdsWhiteList);
        const chatSharingSettings2 = new ChatSharingSettings(mockChatId2, mockEmptyUserIdsWhiteList);
        
        const link1 = await chatSharingSettings1.getLink();
        const link2 = await chatSharingSettings2.getLink();

        expect(link1).not.toBe(link2);
    });

    it('should generate a valid format link', async () => {       
        const link = await defaultSharingSettings.getLink();
        expect(link).toMatch(linkFormat);
    });
});