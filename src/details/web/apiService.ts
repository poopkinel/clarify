// A serivce to manage the backend API

import WebInPort from "../../boundaries/web/webInPort";
import { WebOutPort } from "../../boundaries/web/webOutPort";
import { ProceedInChatResultModel } from "../../dataModels/useCaseBoundaries/specific/proceedInChatResultModel";
import ChatStartResultModel from "../../dataModels/v1/chatStartResultModel";

import { Express } from 'express';

export class ApiService implements WebOutPort {
  private app: Express;
  private webInPort: WebInPort;

  constructor(app: Express, webInPort: WebInPort) {
    this.app = app;
    this.webInPort = webInPort;
  }

  async setUp(app: Express, webInPort: WebInPort) {
    this.app = app;
    this.webInPort = webInPort;
    this.app.get('/', async (req, res) => {
            const request = {
                chatName: 'TestChat10000',
                userId: 'TestUser1'
            };
            const resultModel = await this.webInPort.startNewChat(request);
            const response = await this.sendStartNewChatResult(resultModel);
            res.json(response);
        });
    
    this.app.get('/next-phase', async (req, res) => {
      console.log("REQ2:" + req.body);
      // res.json({
      //   Test: 'TEST'
      // });
      // const resultNextPhaseModel = new ProceedInChatResultModel((), req.params);
    });
  }
  async sendStartNewChatResult(chatStartResultModel: ChatStartResultModel): Promise<any>{
        return {
            // chatId: chatStartResultModel.chatId,
            chatId: "YYY",
            chatName: chatStartResultModel.chatName,
            username: chatStartResultModel.username,
            error: chatStartResultModel.error
        };
    }
}
