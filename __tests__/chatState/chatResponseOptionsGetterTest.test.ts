class ChatResponseOptionsGetter {
    runTests() {
        describe('Given a dummy chat state (for getting chat options) with empty options for all participants [/parties]', () => {
            describe('When response options are loaded', () => {
                it('should equal an empty list for each participant [/party]', async () => {
                    const chatStateForSendChatReponse = {
                        getChatResponseOptions: jest.fn().mockResolvedValue([])
                    };
                    const options = await chatStateForSendChatReponse.getChatResponseOptions();
                    expect(options).toEqual([]);
                })
            })
        })
        describe('Given a chat state with 1 option for each participant [/party]', () => {
            describe('When response options are loaded', () => {
                it('should equal a list with 1 option for each participant [/party]', async () => {
                    const chatStateForSendChatReponse = {
                        getChatResponseOptions: jest.fn().mockResolvedValue([1])
                    };
                    const options = await chatStateForSendChatReponse.getChatResponseOptions();
                    expect(options).toEqual([1]);
                });
            })
        })
    }
}

const chatResponseOptionsGetter = new ChatResponseOptionsGetter();
chatResponseOptionsGetter.runTests();