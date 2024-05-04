// A test to create a new chat

const { ChatEntity } = require("../src/entities/chatEntity");
const { CreateATestChatUseCase } = require("../src/useCases/createATestChatUseCase");
const { ChatGatewayFirebaseImpl } = require("../src/details/persistence/chatGatewayFirebaseImpl");
const { ChatGatewaySqliteImpl } = require("../src/details/persistence/chatGatewaySqliteImpl");
const { RetrieveAChat: RetrieveAChatUseCase } = require("../src/useCases/retrieveAChatUseCase");
const { ResponseEntity, ResponseType } = require("../src/entities/responseEntity");
const { ViewAllChatsUseCase } = require("../src/useCases/viewAllChatsUseCase");

// var responses = 
//   [
//     new ResponseEntity('1', '1', 'other', ResponseType.TEXT, 'Ross, you slept with another woman!', null, null),
//     new ResponseEntity('2', '2', 'system', ResponseType.TEXT, 'Ross says he understands what you\'re saying. Here is what he understands:', null, null),
//     new ResponseEntity('3', '3', 'user', ResponseType.TEXT, 'WE WERE ON A BREAK', null, null),
//     new ResponseEntity('4', '4', 'system', ResponseType.TEXT, 'Rachel says that\'s not what she meant. Here is another way to say it:', null, null),
//     new ResponseEntity('5', '5', 'other', ResponseType.TEXT, 'You just went on and slept with someone you just met. How could you?!', null, null),
//     new ResponseEntity('6', '6', 'system', ResponseType.TEXT, 'Ross says he understands what you mean. Here it is:', null, null),
//     new ResponseEntity('7', '7', 'user', ResponseType.TEXT, 'Okay I get it, you are upset.', null, null),
//     new ResponseEntity('8', '8', 'system', ResponseType.TEXT, 'Rachel says that\'s not what she\'s saying. There it is another way:', null, null),
//     new ResponseEntity('9', '9', 'other', ResponseType.TEXT, 'Upset?! Yes I\'m upset! How could you do this to us? I just can\'t believe you!', null, null),
//     new ResponseEntity('10', '10', 'system', ResponseType.TEXT, 'Ross says he understands:', null, null),
//     new ResponseEntity('11', '11', 'user', ResponseType.TEXT, 'You are so deeply hurt about me sleeping with another woman, and you can\'t believe how could I have done this to us. You feel shock and pain and you don\'t understand how I could possibly think this was okay to do.', null, null),
//     new ResponseEntity('12', '12', 'system', ResponseType.TEXT, 'Rachel says that\'s correct. Ross, it\'s you\'re turn to say what you have in mind.', null, null),
//     new ResponseEntity('13', '13', 'system', ResponseType.TEXT, 'Ross wants to say something:', null, null),
//     new ResponseEntity('14', '14', 'user', ResponseType.TEXT, 'Rachel, please, you have to understand — I thought we were on a break. I thought we were done.', null, null),
//     new ResponseEntity('15', '15', 'system', ResponseType.TEXT, 'Rachel does not understand you. She now asks you a question:', null, null),
//     new ResponseEntity('16', '16', 'other', ResponseType.TEXT, 'And it justifies it?! How could you think that???', null, null)
//   ];

describe('Chat Operations', () => {
    // it('should create a new chat', async () => {
    //     const chatGateway = new ChatGatewaySqliteImpl();
    //     const useCase = new OperatorCreatesATestChat(chatGateway);
    //     const chatId = await useCase.execute("TestChat0", "TestUser1", "TestUser2");
    //     expect(chatId).not.toBeNull();
    //     expect(chatId).toBeDefined();
        
    //     const chat = await chatGateway.getChatById(chatId);
    //     expect(chat).toBeInstanceOf(ChatEntity);
    //     expect(chat.responses).not.toBeNull();
    //     expect(chat.responses).toBeDefined();
    // });

    it('should retrieve the test chat', async () => {
        const chatGateway = new ChatGatewaySqliteImpl();
        const useCase = new RetrieveAChatUseCase(chatGateway);
        
        const chatId = '0';
        const chat = await useCase.execute(chatId);
        // console.log('chat.id', chat.id);

        expect(chat.id === chatId).toBeTruthy();
        expect(chat).toBeInstanceOf(ChatEntity);
        expect(chat.responses).not.toBeNull();
        expect(chat.responses).toBeDefined();
    });

    it('should throw an error when chatId is not found', async () => {
        const chatGateway = new ChatGatewaySqliteImpl();
        const useCase = new RetrieveAChatUseCase(chatGateway);
        
        const chatId = '-100';
        try {
            await useCase.execute(chatId);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Chat not found');
        }
    });        

    it('should return list of all chats (or up to 1000)', async () => {
        const chatGateway = new ChatGatewaySqliteImpl();
        const useCase = new ViewAllChatsUseCase(chatGateway);
        
        var chats = await useCase.execute();

        expect(chats).not.toBeNull();
        expect(chats).toBeDefined();
        expect(chats.length).toBeGreaterThan(0);
    });
});