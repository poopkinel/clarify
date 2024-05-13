import { ChatGateway } from "../../boundaries/persistence/chatGateway";
import { ChatViewResponseModel } from "../../dataModels/chatViewResponseModel";
import { ChatMessageResponseModel } from "../../dataModels/chatMessageResponseModel";
import { ResponseEntity } from "../../entities/responseEntity";
import { ChatEntity } from "../../entities/chatEntity";

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const chatsTableName = 'chats';

// let db = new sqlite3.Database('../../../persistent_data/chats.db', (err) => {
const db = new sqlite3.Database('./sqlite3.db', (err: any) => {});


export class ChatGatewaySqliteImpl implements ChatGateway {
    constructor() {
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${chatsTableName}'`, (err: any, result: any) => {
            if (err) {
                console.log(err);
            }
            if (result === undefined) {
                db.run(`CREATE TABLE ${chatsTableName} 
                        (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, user1 TEXT, user2 TEXT)`, (err: any) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    async createChat(chatName: string, user1: string, user2: string): Promise<string> {
        const sql = `INSERT INTO ${chatsTableName} (name, user1, user2) VALUES ('${chatName}', '${user1}', '${user2}') RETURNING *;`;
        // console.log(sql);

        var chatId = "";

        // const { err, result } = await db.get(sql);
        const out: any = await new Promise(resolve => {
            db.get(sql, (err: any, row: any) => {
                if (err) {
                    resolve({ 'error': err });
                    console.log(err);
                } else {
                    resolve({ 'result': row });
                }
            });
        });
        
        chatId = out['result']['id'];

        // console.log('Chat returned', chatId);
        return chatId;
    }

    async getAllChats(): Promise<ChatEntity[]> {
        const sql = `SELECT * FROM ${chatsTableName} LIMIT 100;`;
        let chats: ChatEntity[] = [];

        var db = await open({ filename: './sqlite3.db', driver: sqlite3.Database });
        if (db === undefined) {
            console.log('Error opening database');
            return chats;
        }

        try {
            const rows = await db.all(sql);  // using all() with async/await
            
            rows.forEach((row: any) => {
                chats.push(new ChatEntity(
                    row.id,
                    row.name,
                    row.user1,
                    row.user2
                ));
            });

            return chats;

        } catch (err: any) {
            console.error('Error when fetching chats:', err);
            throw err;  // rethrow the error if you want to handle it further up the chain
        } finally {
            if (db) {
                db.close(); // Make sure to close the database connection
            }
        }
            
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

    async isChatNameUnique(chatName: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}