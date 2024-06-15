import ChatEntityForProceedInChat from '../../src/entities/chatEntity/chatEntityForProceedInChat';
import ChatFlowEntity from '../../src/entities/chatFlow/chatFlowEntity';

class StateTransitionTest {
    currentStateStub = {
        id: "state1",
        participator1NextState: "state1",
        participator2NextState: "state1",
        participator1Options: {
            options: [],
        },
        participator2Options: {
            options: [],
        },
        isEndState: false,
        proceedEvent: "", // TODO: remove proceedEvent
    };

    chatStub = {
        currentState: {
            ...this.currentStateStub
        },
        participator1UserId: '',
        participator2UserId: '',
        chatFlowId: '',
        isEnded: false
    };

    runTests() {
        describe('Given a chatFlow with a single transition', () => {
            it('should change the current state id in chat to the transitioned state id', async () => {
                const { chatFlow, chat, event } = this.arrange();

                const nextStateInFlow = await chatFlow.tryGetNextState(chat.currentState, event);
                chat.setCurrentState(nextStateInFlow.nextState);
                
                expect(chat.currentState.id).toEqual(nextStateInFlow.nextState.id);
            });
        });
    }

    private arrange() {
        const chat: ChatEntityForProceedInChat = {
            ...this.chatStub,
            currentState: {
                ...this.currentStateStub
            },
            setCurrentState: jest.fn().mockImplementation(
                (newCurrentState) => {
                    chat.currentState = newCurrentState;
                }
            ),
        };
        const event = "event";

        const chatFlow = new ChatFlowEntity();
        return { chatFlow, chat, event };
    }
}

const stateTransitionTest = new StateTransitionTest();
stateTransitionTest.runTests();