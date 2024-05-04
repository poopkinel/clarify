// A test for a viewer of a chat
// The viewer can see the chat messages

const { UserViewsAChatUseCase } = require("../src/useCases/userViewsAChatUseCase");
const { UserGatewayFirebaseImpl } = require("../src/details/persistence/userGatewayFirebaseImpl");
const { ChatGatewayMockImpl } = require("../src/details/persistence/chatGatewayMockImpl");

const userGateway = new UserGatewayFirebaseImpl();
const chatGateway = new ChatGatewayMockImpl();
const useCase = new UserViewsAChatUseCase(userGateway, chatGateway);


describe('UserViewsAChatUseCase', () => {
    it('should return a valid chat', () => {
        const chatRequestModel = {
            chatId: '0',
            userId: 'MpZ4gj5ciwX7tne3ssyfKSb1Ber1'
        };
        useCase.execute(chatRequestModel)
            .then((response) => {
                expect(response).not.toBeNull();
                expect(response).toBeDefined();
                expect(response.chatId).toBe('0');
            });
    });

    it('should return different chats based on id', () => {
        const chatRequestModel1 = {
            chatId: '1',
            userId: 'MpZ4gj5ciwX7tne3ssyfKSb1Ber1'
        };
        useCase.execute(chatRequestModel1)
            .then((response) => {
                expect(response).not.toBeNull();
                expect(response).toBeDefined();
                expect(response.chatId).toBe('1');
            });
        
        const chatRequestModel2 = {
            chatId: '2',
            userId: 'MpZ4gj5ciwX7tne3ssyfKSb1Ber1'
        };

        useCase.execute(chatRequestModel2)
            .then((response) => {
                expect(response).not.toBeNull();
                expect(response).toBeDefined();
                expect(response.chatId).toBe('2');
            });
    });
});
