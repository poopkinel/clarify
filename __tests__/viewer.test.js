// A test for a viewer of a chat
// The viewer can see the chat messages

const { UserViewsAChatUseCase } = require("../src/useCases/userViewsAChatUseCase");
const { UserGatewayFirebaseImpl } = require("../src/details/persistence/userGatewayFirebaseImpl");
const { ChatGatewaySqliteImpl } = require("../src/details/persistence/chatGatewaySqliteImpl");

const userGateway = new UserGatewayFirebaseImpl();
const chatGateway = new ChatGatewaySqliteImpl();
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

    it('should return the chat with the correct id', () => {
        const chatRequestModel = {
            chatId: '1',
            userId: 'MpZ4gj5ciwX7tne3ssyfKSb1Ber1'
        };
        useCase.execute(chatRequestModel)
            .then((response) => {
                expect(response).not.toBeNull();
                expect(response).toBeDefined();
                expect(response.chatId).toBe('1');
            });
    });
});
