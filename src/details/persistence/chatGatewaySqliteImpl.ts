import { ChatGateway } from "../../boundaries/persistence/chatGateway";
import { ChatViewResponseModel } from "../../dataModels/chatViewResponseModel";
import { ChatMessageResponseModel } from "../../dataModels/chatMessageResponseModel";
import { ResponseEntity } from "../../entities/responseEntity";
import { ChatEntity } from "../../entities/chatEntity";

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const chatsTableName = 'chats';

// let db = new sqlite3.Database('../../../persistent_data/chats.db', (err) => {
const db = new sqlite3.Database('./sqlite3.db', (err) => {});


export class ChatGatewaySqliteImpl implements ChatGateway {
    constructor() {
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${chatsTableName}'`, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result === undefined) {
                db.run(`CREATE TABLE ${chatsTableName} 
                        (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, user1 TEXT, user2 TEXT)`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    async createChat(chatName: string, user1: string, user2: string): Promise<string> {
        const sql = `INSERT INTO ${chatsTableName} (name, user1, user2) VALUES ('${chatName}', '${user1}', '${user2}');`;
        //console.log(sql);

        var chatId = "";

        db.get(sql), (err, result) => {
                if (err) {
                    console.log(err);
                }
                if (result === undefined) {
                    console.log('Error creating chat');
                } else {
                    console.log('Chat created', result);
                    chatId = result.id;
                }
            };

        console.log('Chat created', chatId);
        return chatId;
    }

    async getAllChats(): Promise<ChatEntity[]> {
        const sql = `SELECT * FROM ${chatsTableName} LIMIT 10;`;
        let chats: ChatEntity[] = [];

        var db = await open({ filename: './sqlite3.db', driver: sqlite3.Database });
        if (db === undefined) {
            console.log('Error opening database');
            return chats;
        }

        try {
            const rows = await db.all(sql);  // using all() with async/await
            
            rows.forEach(row => {
                chats.push(new ChatEntity(
                    row.id,
                    row.name,
                    row.user1,
                    row.user2
                ));
            });

            return chats;
            
        } catch (err) {
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
}