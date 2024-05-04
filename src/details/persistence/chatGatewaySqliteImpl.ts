import { ChatGateway } from "../../boundaries/persistence/chatGateway";
import { ChatViewResponseModel } from "../../dataModels/chatViewResponseModel";
import { ChatMessageResponseModel } from "../../dataModels/chatMessageResponseModel";
import { ResponseEntity } from "../../entities/responseEntity";
import { ChatEntity } from "../../entities/chatEntity";

const sqlite3 = require('sqlite3');

let chatsTableName = 'chats';

// let db = new sqlite3.Database('../../../persistent_data/chats.db', (err) => {
let db = new sqlite3.Database('./sqlite3.db', (err) => {});


export class ChatGatewaySqliteImpl implements ChatGateway {
    constructor() {
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${chatsTableName}'`, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result === undefined) {
                db.run(`CREATE TABLE ${chatsTableName} 
                        (id INTEGER PRIMARY KEY, name TEXT, user1 TEXT, user2 TEXT)`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    async createChat(chatName: string, user1: string, user2: string): Promise<string> {
        return 'chatId';
    }

    async getChatById(chatId: string): Promise<ChatEntity> {
        if (chatId === '0') {
            return new ChatEntity(
                "0",
                "chatName",
                "user1",
                "user2",
            );
        } else {
            return new ChatEntity(
                "1",
                "chatName1",
                "user1",
                "user2",
            );
        }
    }

    async addMessageToChat(chatId: string, messageText: string, messageAuthor: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deleteChat(chatId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}