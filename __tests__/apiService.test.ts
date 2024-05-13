// A test for the ApiService class

// import '@types/jest';

import express from 'express';
const appMock = express();

import WebInPortMock from '../src/details/web/webInPortMock';

import { ApiService } from "../src/details/web/apiService";
import ChatStartResultModel from '../src/dataModels/chatStartResultModel';

describe('ApiService', () => {
    it('should return relevant data for start new chat', async () => {
        const webInPortMock = new WebInPortMock();
        const apiService = new ApiService(appMock, webInPortMock);
        const startNewChatResult = new ChatStartResultModel('chatId', 'chatName', 'error');
        const startChatDataResponse = await apiService.sendStartNewChatResult(startNewChatResult);

        expect(startChatDataResponse).toBeDefined();
        expect(startChatDataResponse.chatId).toBe('chatId');
        expect(startChatDataResponse.chatName).toBe('chatName');
        expect(startChatDataResponse.error).toBe('error');
    });
});