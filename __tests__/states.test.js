// The ChatFlow class has the following methods:

// - `addTransition(state1, state2, event, newState1, newState2)`: Adds a transition between two states triggered by a specific event.
// - `Proceed(event)`: Proceeds to the next state based on the current state and the event triggered.
// - `setCurrentState(state1, state2)`: Sets the initial current state of the conversation.

const ChatFlow = require('../src/models/ChatFlow');

describe('ChatFlow', () => {
  let chatFlow;
  let mockState1, mockState2;

  beforeEach(() => {
    chatFlow = new ChatFlow();
    mockState1 = { name: 'state1', OnEnter: jest.fn(), OnExit: jest.fn() };
    mockState2 = { name: 'state2', OnEnter: jest.fn(), OnExit: jest.fn() };
  });

  it('should set the current state correctly', () => {
    chatFlow.setCurrentState(mockState1, mockState2);
    expect(chatFlow.currentState.participant1).toBe(mockState1);
    expect(chatFlow.currentState.participant2).toBe(mockState2);
  });

  it('should call OnEnter on the new states when setting current state', () => {
    chatFlow.setCurrentState(mockState1, mockState2);
    expect(mockState1.OnEnter).toHaveBeenCalled();
    expect(mockState2.OnEnter).toHaveBeenCalled();
  });

  it('should transition each participant to their respective new state when an event is triggered', () => {
    let mockEvent = { name: 'event1' };
    let newState3 = { name: 'newState3', OnEnter: jest.fn(), OnExit: jest.fn() };
    let newState4 = { name: 'newState4', OnEnter: jest.fn(), OnExit: jest.fn() };
  
    chatFlow.addTransition(mockState1, mockState2, mockEvent, newState3, newState4);
    chatFlow.setCurrentState(mockState1, mockState2);
    chatFlow.Proceed(mockEvent);
  
    expect(chatFlow.currentState.participant1).toBe(newState3);
    expect(chatFlow.currentState.participant2).toBe(newState4);
  });

  it('should correctly transition between states based on the chat flow', () => {
    let waiting = { name: 'waiting for response', OnEnter: jest.fn(), OnExit: jest.fn() };
    let openSay = { name: 'openSay', OnEnter: jest.fn(), OnExit: jest.fn() };
    let closedUnderstand = { name: 'closedUnderstand', OnEnter: jest.fn(), OnExit: jest.fn() };
    let openParaphrase = { name: 'openParaphrase', OnEnter: jest.fn(), OnExit: jest.fn() };
    let closedConfirmParaphrase = { name: 'closedConfirmParaphrase', OnEnter: jest.fn(), OnExit: jest.fn() };
    let openQuestion = { name: 'openQuestion', OnEnter: jest.fn(), OnExit: jest.fn() };
  
    let participant1Says = { name: 'participant1Says' };
    let participant1UnderstandsYes = { name: 'participant1UnderstandsYes' };
    let participant1UnderstandsNo = { name: 'participant1UnderstandsNo' };
    let participant1Paraphrases = { name: 'participant1Paraphrases' };
    let participant1ConfirmParaphraseYes = { name: 'participant1ConfirmParaphraseYes' };
    let participant1ConfirmParaphraseNo = { name: 'participant1ConfirmParaphraseNo' };
    let participant1Questions = { name: 'participant1Questions' };
    let participant2Says = { name: 'participant2Says' };
    let participant2UnderstandsYes = { name: 'participant2UnderstandsYes' };
    let participant2UnderstandsNo = { name: 'participant2UnderstandsNo' };
    let participant2Paraphrases = { name: 'participant2Paraphrases' };
    let participant2ConfirmParaphraseYes = { name: 'participant2ConfirmParaphraseYes' };
    let participant2ConfirmParaphraseNo = { name: 'participant2ConfirmParaphraseNo' };
    let participant2Questions = { name: 'participant2Questions' };
  
    // Transitions
    chatFlow.addTransition(waiting, openSay, participant2Says, closedUnderstand, waiting);
    chatFlow.addTransition(closedUnderstand, waiting, participant1UnderstandsYes, openParaphrase, waiting);
    chatFlow.addTransition(closedUnderstand, waiting, participant1UnderstandsNo, openQuestion, waiting);
    chatFlow.addTransition(openParaphrase, waiting, participant1Paraphrases, waiting, closedConfirmParaphrase);
    chatFlow.addTransition(waiting, closedConfirmParaphrase, participant2ConfirmParaphraseYes, openSay, waiting);
    chatFlow.addTransition(waiting, closedConfirmParaphrase, participant2ConfirmParaphraseNo, waiting, openSay);
    chatFlow.addTransition(openQuestion, waiting, participant1Questions, waiting, openSay);
    
    chatFlow.addTransition(openSay, waiting, participant1Says, waiting, closedUnderstand);
    chatFlow.addTransition(waiting, closedUnderstand, participant2UnderstandsYes, waiting, openParaphrase);
    chatFlow.addTransition(waiting, closedUnderstand, participant2UnderstandsNo, waiting, openQuestion);
    chatFlow.addTransition(waiting, openParaphrase, participant2Paraphrases, closedConfirmParaphrase, waiting);
    chatFlow.addTransition(closedConfirmParaphrase, waiting, participant1ConfirmParaphraseYes, waiting, openSay);
    chatFlow.addTransition(closedConfirmParaphrase, waiting, participant1ConfirmParaphraseNo, openSay, waiting);
    chatFlow.addTransition(waiting, openQuestion, participant2Questions, openSay, waiting);
    
    // Start state
    chatFlow.setCurrentState(waiting, openSay);
  
    // Test the chat flow

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

