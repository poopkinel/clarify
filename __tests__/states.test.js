// The ChatFlow class has the following methods:

// - `addTransition(state1, state2, event, newState1, newState2)`: Adds a transition between two states triggered by a specific event.
// - `Proceed(event)`: Proceeds to the next state based on the current state and the event triggered.
// - `setCurrentState(state1, state2)`: Sets the initial current state of the conversation.

const { states, events, transitions, initialState } = require('../src/config/chatConfig');
const ChatFlow = require('../src/models/ChatFlow');

describe('ChatFlow', () => {
  let mockChatFlow;
  let mockState1, mockState2;

  beforeEach(() => {
    mockChatFlow = new ChatFlow();
    mockState1 = { name: 'state1', OnEnter: jest.fn(), OnExit: jest.fn() };
    mockState2 = { name: 'state2', OnEnter: jest.fn(), OnExit: jest.fn() };
  });

  it('should set the current state correctly', () => {
    mockChatFlow.setCurrentState(mockState1, mockState2);
    expect(mockChatFlow.currentState.participant1).toBe(mockState1);
    expect(mockChatFlow.currentState.participant2).toBe(mockState2);
  });

  it('should call OnEnter on the new states when setting current state', () => {
    mockChatFlow.setCurrentState(mockState1, mockState2);
    expect(mockState1.OnEnter).toHaveBeenCalled();
    expect(mockState2.OnEnter).toHaveBeenCalled();
  });

  it('should transition each participant to their respective new state when an event is triggered', () => {
    let mockEvent = { name: 'event1' };
    let newState3 = { name: 'newState3', OnEnter: jest.fn(), OnExit: jest.fn() };
    let newState4 = { name: 'newState4', OnEnter: jest.fn(), OnExit: jest.fn() };
  
    mockChatFlow.addTransition(mockState1, mockState2, mockEvent, newState3, newState4);
    mockChatFlow.setCurrentState(mockState1, mockState2);
    mockChatFlow.Proceed(mockEvent);
  
    expect(mockChatFlow.currentState.participant1).toBe(newState3);
    expect(mockChatFlow.currentState.participant2).toBe(newState4);
  });

  it('should correctly transition between states based on the chat flow', () => {
    let chatFlow = new ChatFlow();
    
    chatFlow.setCurrentState(initialState[0], initialState[1]);
    
    transitions.forEach(({ from, to, event }) => {
        chatFlow.addTransition(states[from[0]], states[from[1]], events[event], states[to[0]], states[to[1]]);
    });

    let participant1Says = events.participant1Says;
    let participant1UnderstandsYes = events.participant1UnderstandsYes;
    let participant1UnderstandsNo = events.participant1UnderstandsNo;
    let participant1Paraphrases = events.participant1Paraphrases;
    let participant1ConfirmParaphraseYes = events.participant1ConfirmParaphraseYes;
    let participant1ConfirmParaphraseNo = events.participant1ConfirmParaphraseNo;
    let participant1Questions = events.participant1Questions;
    let participant2Says = events.participant2Says;
    let participant2UnderstandsYes = events.participant2UnderstandsYes;
    let participant2UnderstandsNo = events.participant2UnderstandsNo;
    let participant2Paraphrases = events.participant2Paraphrases;
    let participant2ConfirmParaphraseYes = events.participant2ConfirmParaphraseYes;
    let participant2ConfirmParaphraseNo = events.participant2ConfirmParaphraseNo;
    let participant2Questions = events.participant2Questions;

    let waiting = states.waiting;
    let openSay = states.openSay;
    let closedUnderstand = states.closedUnderstand;
    let openParaphrase = states.openParaphrase;
    let closedConfirmParaphrase = states.closedConfirmParaphrase;
    let openQuestion = states.openQuestion;

    chatFlow.Proceed(participant2Says);
    expect(chatFlow.currentState.participant1).toBe(closedUnderstand);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    chatFlow.Proceed(participant1UnderstandsNo);
    expect(chatFlow.currentState.participant1).toBe(openQuestion);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    chatFlow.Proceed(participant1Questions);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(openSay);

    // Full praticipant 1 question cycle completed
    
    chatFlow.Proceed(participant2Says);
    expect(chatFlow.currentState.participant1).toBe(closedUnderstand);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    chatFlow.Proceed(participant1UnderstandsYes);
    expect(chatFlow.currentState.participant1).toBe(openParaphrase);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    chatFlow.Proceed(participant1Paraphrases);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(closedConfirmParaphrase);

    chatFlow.Proceed(participant2ConfirmParaphraseNo);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(openSay);

    // Full participant 1 paraphrase not confirmed cycle completed

    chatFlow.Proceed(participant2Says);
    expect(chatFlow.currentState.participant1).toBe(closedUnderstand);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    chatFlow.Proceed(participant1UnderstandsYes);
    expect(chatFlow.currentState.participant1).toBe(openParaphrase);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    chatFlow.Proceed(participant1Paraphrases);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(closedConfirmParaphrase);

    chatFlow.Proceed(participant2ConfirmParaphraseYes);
    expect(chatFlow.currentState.participant1).toBe(openSay);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    // First participant 1 paraphrase confirmed cycle completed

    chatFlow.Proceed(participant1Says);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(closedUnderstand);

    chatFlow.Proceed(participant2UnderstandsYes);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(openParaphrase);

    chatFlow.Proceed(participant2Paraphrases);
    expect(chatFlow.currentState.participant1).toBe(closedConfirmParaphrase);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    chatFlow.Proceed(participant1ConfirmParaphraseNo);
    expect(chatFlow.currentState.participant1).toBe(openSay);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    // Full participant 2 paraphrase not confirmed cycle completed

    chatFlow.Proceed(participant1Says);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(closedUnderstand);

    chatFlow.Proceed(participant2UnderstandsNo);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(openQuestion);

    chatFlow.Proceed(participant2Questions);
    expect(chatFlow.currentState.participant1).toBe(openSay);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    // Full participant 2 question cycle completed

    chatFlow.Proceed(participant1Says);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(closedUnderstand);

    chatFlow.Proceed(participant2UnderstandsYes);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(openParaphrase);

    chatFlow.Proceed(participant2Paraphrases);
    expect(chatFlow.currentState.participant1).toBe(closedConfirmParaphrase);
    expect(chatFlow.currentState.participant2).toBe(waiting);

    chatFlow.Proceed(participant1ConfirmParaphraseYes);
    expect(chatFlow.currentState.participant1).toBe(waiting);
    expect(chatFlow.currentState.participant2).toBe(openSay);

    // Full participant 1 paraphrase confirmed cycle completed
  });
});

