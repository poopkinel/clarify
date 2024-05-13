// A serivce to manage the backend API

import WebInPort from "../../boundaries/web/webInPort";
import { WebOutPort } from "./webOutPort";
import ChatStartResultModel from "../../dataModels/chatStartResultModel";

import { Express } from 'express';

export class ApiService implements WebOutPort {
  private app: Express;
  private webInPort: WebInPort;

  constructor(app: Express, webInPort: WebInPort) {
    this.app = app;
    this.webInPort = webInPort;
  }

  setInBoundary(inBoundary: WebInPort) {
    this.webInPort = inBoundary;
  }

  async setUp(app: Express) {
    this.app = app;
    this.app.get('/', async (req, res) => {
            const request = {
                chatName: 'TestChat0',
                userId: 'TestUser1'
            };
            const resultModel = await this.webInPort.startNewChat(request);
            const response = await this.sendStartNewChatResult(resultModel);
            res.json(response);
        });
    }

  async sendStartNewChatResult(chatStartResultModel: ChatStartResultModel): Promise<any>{
        return {
            chatId: chatStartResultModel.chatId,
            chatName: chatStartResultModel.chatName,
            error: chatStartResultModel.error
        };
    }
}
