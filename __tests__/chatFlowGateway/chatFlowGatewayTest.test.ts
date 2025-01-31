import ChatEntity from "../../src/entities/chatEntity/chatEntity";
import ChatEntityForProceedInChat from "../../src/entities/chatEntity/chatEntityForProceedInChat";
import ChatStateForProceedInChat from "../../src/entities/chatState/chatState";
import ChatFlowGateway from "../../src/mocks/chatFlowGateway/ChatFlowGatewayMock";


class ChatFlowGatewayTest {
    setup = {
        states: (
            {
                id: "state1",
                participator1NextState: "state2",
                participator2NextState: "state2",
                participator1Options: {
                    options: (),
                },
                participator2Options: {
                    options: (),
                },
                isEndState: false,
            },
            {
                id: "state2",
                participator1NextState: "state3",
                participator2NextState: "state3",
                participator1Options: {
                    options: (),
                },
                participator2Options: {
                    options: (),
                },
                isEndState: true,
            }
        ),

        events: (
            'event1',
            'event2'
        ),

        transitions: (
            {state: "state1", event: "event1", nextState: "state2"},
            {state: "state2", event: "event2", nextState: "state3"}
        )

    }

    runTests() {
        describe('Given a chatFlow with 2 transitions', () => {
            it('should follow transitions and produce correct state ids for each step', async () => {
                const chat = ChatEntity.fromJson(
                    {
                        id: "chatId",
                        name: "chatName",
                        participator1UserId: "participator1UserId",
                        participator2UserId: "participator2UserId",
                        createSuccess: true,
                        currentState: this.setup.states(0) as ChatStateForProceedInChat,
                        isEnded: false
                    }
                ) as ChatEntityForProceedInChat;

                const chatFlowId = "chatFlowId";

                const chatFlowGateway = this.arrange();

                const chatFlow = await chatFlowGateway.getChatFlowById(chatFlowId);

                const nextStateInFlow = await chatFlow.tryGetNextState(chat.currentStateId, event);

                const nextStateInFlow2 = await chatFlow.tryGetNextState(chat.currentStateId, event);
            });
        });
    }

    arrange() {
        return new ChatFlowGateway();
    }
}

const chatFlowGatewayTest = new ChatFlowGatewayTest();
chatFlowGatewayTest.runTests();
