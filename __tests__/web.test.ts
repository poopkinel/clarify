import { WebInPortImpl } from '../src/details/web/webInPortImpl';
import { PersonRegistersAsUserUseCase } from '../src/useCases/personRegistersAsUserUseCase';
import { ChatGatewayMockImpl } from '../src/details/persistence/chatGatewayMockImpl';
import { UserGatewayMockImpl } from '../src/details/persistence/userGatewayMockImpl';
import { ChatStartRequestModel } from '../src/dataModels/chatStartRequestModel';
import { ApiService } from '../src/details/web/apiService';

import express from 'express';
import { UserRequestModel } from '../src/dataModels/userRequestModel';
import ChatStartResultModel from '../src/dataModels/chatStartResultModel';
const appMock = express();

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

describe('WebOutPort sends start new chat data', () => {
    it('should send valid start new chat data', async () => {
        const gateway = new UserGatewayMockImpl();
        const useCase = new PersonRegistersAsUserUseCase(gateway);
        const webInPort = new WebInPortImpl(useCase);
        const webOutPort = new ApiService(appMock, webInPort);

        const resultModel = new ChatStartResultModel('testChat0', 'chatName', 'username', 'testErrorMessage');
        const response = await webOutPort.sendStartNewChatResult(resultModel);

        expect(response).toBeDefined();
        expect(response).toHaveProperty('chatId');
        expect(response).toHaveProperty('chatName');
        expect(response).toHaveProperty('username');
        expect(response).toHaveProperty('error');
        
        expect(response.chatId).toBe('testChat0');
        expect(response.chatName).toBe('chatName');
        expect(response.username).toBe('username');
        expect(response.error).toBe('testErrorMessage');
    });
});