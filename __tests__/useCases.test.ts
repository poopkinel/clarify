import { CreateATestChatUseCase } from '../src/useCases/createATestChatUseCase';
import { ChatGatewayMockImpl } from '../src/details/persistence/chatGatewayMockImpl';
import { CreateANewUserUseCase } from '../src/useCases/createANewUserUseCase';
import { UserRequestModel } from '../src/dataModels/userRequestModel';
import { UserGatewayFirebaseImpl } from '../src/details/persistence/userGatewayFirebaseImpl';
import { User } from '../src/entities/userEntity';
import { ChatGatewaySqliteImpl } from '../src/details/persistence/chatGatewaySqliteImpl';

describe('Create A New User By Operator', () => {
    it('should create a new user on firebase', async () => {
        const userGateway = new UserGatewayFirebaseImpl();
        const createANewUser = new CreateANewUserUseCase(userGateway);
        const user = await createANewUser.execute(new UserRequestModel('testUser', 'testPassword'));

        expect(user).toBeDefined();
        expect(user?.id).toBeDefined();
        expect(user?.id.length).toBe("5gfDmf9Xk7XXjMvZ8Zf2Q2FvMX63".length);
        expect(user?.username).toBe('testUser');

        // Cleanup
        await userGateway.deleteUser(user as User);
    });
});

describe('CreateATestChatUseCase', () => {
    it('should create a test chat on Sqlite db', async () => {
        const chatGateway = new ChatGatewaySqliteImpl();
        const createATestChatUseCase = new CreateATestChatUseCase(chatGateway);
        const chatId = await createATestChatUseCase.execute('testChat', 'user1', 'user2');

        expect(chatId).toBeDefined();
        expect(chatId).toEqual(expect.any(Number));
        expect(chatId).toBeGreaterThan(0);
    });
});