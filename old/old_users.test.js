const { UserGatewayFirebaseImpl } = require('../src/details/persistence/v1/userGatewayFirebaseImpl');
const { PersonRegistersAsUserUseCase } = require('../src/useCases/personRegistersAsUserUseCase');
const { RegistrationInputModel } = require('../src/dataModels/old/registrationInputModel');
const { DeleteUserUseCase } = require('../src/useCases/deleteUserUseCase');
const { User } = require('../src/entities/userEntity');
const { UserRequestModel } = require('../src/dataModels/old/userRequestModel');
const { ChatGatewaySqliteImpl } = require('../src/details/persistence/v1/chatGatewaySqliteImpl');
const { RetrieveAChatUseCase } = require('../src/useCases/retrieveAChatUseCase');
const { ChatEntity } = require('../src/entities/chatEntity');

describe.skip('createUser', () => {
    it.skip('should create a new user', async () => {
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

