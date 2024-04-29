const ChatState = require('../entities/ChatState');

const states = {
    waiting: new ChatState({ name: 'waiting'}),
    openSay: new ChatState({ name: 'openSay' }),
    closedUnderstand: new ChatState({ name: 'closedUnderstand' }),
    openParaphrase: new ChatState({ name: 'openParaphrase' }),
    closedConfirmParaphrase: new ChatState({ name: 'closedConfirmParaphrase' }),
    openQuestion: new ChatState({ name: 'openQuestion' })
}

const events = {
    participant1Says: { name: 'participant1Says' },
    participant1UnderstandsYes: { name: 'participant1UnderstandsYes' },
    participant1UnderstandsNo: { name: 'participant1UnderstandsNo' },
    participant1Paraphrases: { name: 'participant1Paraphrases' },
    participant1ConfirmParaphraseYes: { name: 'participant1ConfirmParaphraseYes' },
    participant1ConfirmParaphraseNo: { name: 'participant1ConfirmParaphraseNo' },
    participant1Questions: { name: 'participant1Questions' },
    participant2Says: { name: 'participant2Says' },
    participant2UnderstandsYes: { name: 'participant2UnderstandsYes' },
    participant2UnderstandsNo: { name: 'participant2UnderstandsNo' },
    participant2Paraphrases: { name: 'participant2Paraphrases' },
    participant2ConfirmParaphraseYes: { name: 'participant2ConfirmParaphraseYes' },
    participant2ConfirmParaphraseNo: { name: 'participant2ConfirmParaphraseNo' },
    participant2Questions: { name: 'participant2Questions' }
};

const transitions = [
    { from: ['waiting', 'openSay'], to: ['closedUnderstand', 'waiting'], event: 'participant2Says' },
    { from: ['closedUnderstand', 'waiting'], to: ['openParaphrase', 'waiting'], event: 'participant1UnderstandsYes' },
    { from: ['closedUnderstand', 'waiting'], to: ['openQuestion', 'waiting'], event: 'participant1UnderstandsNo' },
    { from: ['openParaphrase', 'waiting'], to: ['waiting', 'closedConfirmParaphrase'], event: 'participant1Paraphrases' },
    { from: ['waiting', 'closedConfirmParaphrase'], to: ['openSay', 'waiting'], event: 'participant2ConfirmParaphraseYes' },
    { from: ['waiting', 'closedConfirmParaphrase'], to: ['waiting', 'openSay'], event: 'participant2ConfirmParaphraseNo' },
    { from: ['openQuestion', 'waiting'], to: ['waiting', 'openSay'], event: 'participant1Questions' },
    { from: ['openSay', 'waiting'], to: ['waiting', 'closedUnderstand'], event: 'participant1Says' },

    { from: ['openSay', 'waiting'], to: ['waiting', 'closedUnderstand'], event: 'participant1Says'},
    { from: ['waiting', 'closedUnderstand'], to: ['waiting', 'openParaphrase'], event: 'participant2UnderstandsYes' },
    { from: ['waiting', 'closedUnderstand'], to: ['waiting', 'openQuestion'], event: 'participant2UnderstandsNo' },
    { from: ['waiting', 'openParaphrase'], to: ['closedConfirmParaphrase', 'waiting'], event: 'participant2Paraphrases' },
    { from: ['closedConfirmParaphrase', 'waiting'], to: ['waiting', 'openSay'], event: 'participant1ConfirmParaphraseYes' },
    { from: ['closedConfirmParaphrase', 'waiting'], to: ['openSay', 'waiting'], event: 'participant1ConfirmParaphraseNo' },
    { from: ['waiting', 'openQuestion'], to: ['openSay', 'waiting'], event: 'participant2Questions' }
];

module.exports = {
    states: states,
    events: events,
    transitions: transitions,
    initialState: [states['waiting'], states['openSay']]
};