const { UserGatewayFirebaseImpl } = require('../src/details/persistence/userGatewayFirebaseImpl');
const { PersonRegistersAsUserUseCase } = require('../src/useCases/personRegistersAsUserUseCase');
const { RegistrationInputModel } = require('../src/dataModels/registrationInputModel');
const { DeleteUserUseCase } = require('../src/useCases/deleteUserUseCase');
const { User } = require('../src/entities/userEntity');
const { UserRequestModel } = require('../src/dataModels/userRequestModel');
const { ChatGatewaySqliteImpl } = require('../src/details/persistence/chatGatewaySqliteImpl');
const { RetrieveAChatUseCase } = require('../src/useCases/retrieveAChatUseCase');
const { ChatEntity } = require('../src/entities/chatEntity');

describe('createUser', () => {
    it('should create a new user', async () => {
        const gateway = new UserGatewayFirebaseImpl();
        const username = `test${Date.now()}`;
        const password = 'testtest';

        const registrationUseCase = new PersonRegistersAsUserUseCase(gateway);
        const userModel = new UserRequestModel(username, password);
        const user = await registrationUseCase.execute(userModel);

        expect(user).not.toBeNull();
        expect(user).toBeDefined();

        // Clean up 
        const deleteUserUseCase = new DeleteUserUseCase(gateway);
        deleteUserUseCase.execute(user);
    });
});

describe('Operator loads chat data', () => {
    it('should load chat data from Sqlite', async () => {
        const gateway = new ChatGatewaySqliteImpl();
        const chatId = '1'

        const useCase = new RetrieveAChatUseCase(gateway);
        const chat = await useCase.execute(chatId);

        expect(chat).not.toBeNull();
        expect(chat).toBeDefined();
        expect(chat).toBeInstanceOf(ChatEntity);
        expect(chat.id).toBe(chatId);
    });
});