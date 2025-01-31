import ChatEntityForProceedInChat from '../../src/entities/chatEntity/chatEntityForProceedInChat';
import ChatFlowEntity from '../../src/entities/chatFlow/chatFlowEntity';
import ChatEntity from '../../src/entities/chatEntity/chatEntity';

class StateTransitionTest {
    currentStateStub = {
        id: "state1",
        participator1NextState: "state1",
        participator2NextState: "state1",
        participator1Options: {
            options: (),
        },
        participator2Options: {
            options: (),
        },
        isEndState: false,
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

                const nextStateInFlow = await chatFlow.tryGetNextState(chat.currentStateId, event);
                chat.setCurrentState(nextStateInFlow.nextState);
                
                expect(chat.currentStateId.id).toEqual(nextStateInFlow.nextState.id);
            });
        });
    }

    private arrange() {
        const chat = ChatEntity.fromJson({
            id: "chatId",
            name: "chatName",
            participator1UserId: "participator1UserId",
            participator2UserId: "participator2UserId",
            createSuccess: true, 
            currentState: this.currentStateStub,
            isEnded: false
        }) as ChatEntityForProceedInChat;
        
        const event = "event";

        const chatFlow = new ChatFlowEntity();
        return { chatFlow, chat, event };
    }
}

const stateTransitionTest = new StateTransitionTest();
stateTransitionTest.runTests();