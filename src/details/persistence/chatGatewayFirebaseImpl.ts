// An implemenetaion of the chatGateway interface that uses Firebase as a backend

import { ChatGateway } from "../../boundaries/persistence/chatGateway";
import { ChatViewResponseModel } from "../../dataModels/chatViewResponseModel";
import { ChatMessageResponseModel } from "../../dataModels/chatMessageResponseModel";
import { ResponseEntity } from "../../entities/responseEntity";
import { ChatEntity } from "../../entities/chatEntity";

const admin = require("firebase-admin");
var serviceAccount = require("../../../sak.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const db = admin.firestore();

export class ChatGatewayFirebaseImpl implements ChatGateway {
    async createChat(chatName: string, user1: string, user2: string): Promise<string> {
        // const chat: ChatEntity = {
        //     id: '0',
        //     user1: user1,
        //     user2: user2,
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        //     name: chatName,
        //     responses: []
        // };

        // // const chatRef = await admin.firestore().collection("chats").add(chat);

        // let chatRef;

        // try {
        //     const docRef = await db.collection('users').add({
        //       name: 'John Doe',
        //       age: 30,
        //       email: 'johndoe@example.com'
        //     });
        //     console.log('Document written with ID: ', docRef.id);
        //     chatRef = docRef;
        //   } catch (error) {
        //     console.error('Error adding document: ', error);
        // }

        // return chatRef;
        throw new Error("Method not implemented.");
    }

    async getChatById(chatId: string): Promise<ChatEntity> {
        // const chatSnapshot = await admin.firestore().collection("chats").doc(chatId).get();
        // const chatData = chatSnapshot.data();
        // if (chatData === undefined) {
        //     throw new Error("Chat not found");
        // }

        // const chatMessages: ChatMessageResponseModel[] = chatData.chatMessages.map((chatMessage: ResponseEntity) => {
        //     return {
        //         messageText: chatMessage.message,
        //         messageAuthor: chatMessage.userId
        //     };
        // });

        // const chatViewResponseModel: ChatViewResponseModel = {
        //     chatId: chatSnapshot.id,
        //     chatName: chatData.chatName,
        //     chatMessages: chatMessages
        // };

        // return chatViewResponseModel;
        throw new Error("Method not implemented.");
    }

    async addMessageToChat(chatId: string, messageText: string, messageAuthor: string): Promise<void> {
        // const chatRef = admin.firestore().collection("chats").doc(chatId);
        // const chatSnapshot = await chatRef.get();
        // const chatData = chatSnapshot.data();
        // if (chatData === undefined) {
        //     throw new Error("Chat not found");
        // }

        // const chatMessages: ResponseEntity[] = chatData.chatMessages;
        // chatMessages.push({
        //     : messageText,
        //     messageAuthor: messageAuthor
        // });

        // await chatRef.update({
        //     chatMessages: chatMessages
        // });
        throw new Error("Method not implemented.");
    }

    async deleteChat(chatId: string): Promise<void> {
        await admin.firestore().collection("chats").doc(chatId).delete();
    }
}