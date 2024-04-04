// Path: clarify/__tests__/users.test.js

const { createUser } = require('../src/services/userService');

describe('createUser', () => {
    it('should create a new user', async () => {
        const email = `test@test.test`;
        const password = 'testtest';
        const user = await createUser(email, password);
        expect(user).not.toBeNull();

        // Clean up
        await user.delete();
    });
});