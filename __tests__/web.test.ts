// A test suite for the web in port 

// Path: clarify/src/details/web/webInPort.js

// import '@types/jest';

import { WebInPortImpl } from '../src/details/web/webInPortImpl';
import { PersonRegistersAsUserUseCase } from '../src/useCases/personRegistersAsUserUseCase';
import { ChatGatewayMockImpl } from '../src/details/persistence/chatGatewayMockImpl';
import { UserGatewayMockImpl } from '../src/details/persistence/userGatewayMockImpl';
import { ChatStartRequestModel } from '../src/dataModels/chatStartRequestModel';

describe('WebInPort create a user request', () => {
    it('should create a valid request model', () => {
        const gateway = new UserGatewayMockImpl();
        const useCase = new PersonRegistersAsUserUseCase(gateway);
        const webInPort = new WebInPortImpl(useCase);

        const requestModel = webInPort.createRequestModel('username', 'testChat0');

        expect(requestModel).toBeDefined();
        expect(requestModel.username).toBe('username');
        expect(requestModel.chatName).toBe('testChat0');
        expect(requestModel).toBeInstanceOf(ChatStartRequestModel);
    });
});