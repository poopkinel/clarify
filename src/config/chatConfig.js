const ChatState_OLD = require('../entities/ChatState_OLD');

const states = {
    waiting: new ChatState_OLD({ name: 'waiting'}),
    openSay: new ChatState_OLD({ name: 'openSay' }),
    closedUnderstand: new ChatState_OLD({ name: 'closedUnderstand' }),
    openParaphrase: new ChatState_OLD({ name: 'openParaphrase' }),
    closedConfirmParaphrase: new ChatState_OLD({ name: 'closedConfirmParaphrase' }),
    openQuestion: new ChatState_OLD({ name: 'openQuestion' })
}

const events = {
    Participator1Says: { name: 'Participator1Says' },
    Participator1UnderstandsYes: { name: 'Participator1UnderstandsYes' },
    Participator1UnderstandsNo: { name: 'Participator1UnderstandsNo' },
    Participator1Paraphrases: { name: 'Participator1Paraphrases' },
    Participator1ConfirmParaphraseYes: { name: 'Participator1ConfirmParaphraseYes' },
    Participator1ConfirmParaphraseNo: { name: 'Participator1ConfirmParaphraseNo' },
    Participator1Questions: { name: 'Participator1Questions' },
    Participator2Says: { name: 'Participator2Says' },
    Participator2UnderstandsYes: { name: 'Participator2UnderstandsYes' },
    Participator2UnderstandsNo: { name: 'Participator2UnderstandsNo' },
    Participator2Paraphrases: { name: 'Participator2Paraphrases' },
    Participator2ConfirmParaphraseYes: { name: 'Participator2ConfirmParaphraseYes' },
    Participator2ConfirmParaphraseNo: { name: 'Participator2ConfirmParaphraseNo' },
    Participator2Questions: { name: 'Participator2Questions' }
};

const transitions = [
    { from: ['waiting', 'openSay'], to: ['closedUnderstand', 'waiting'], event: 'Participator2Says' },
    { from: ['closedUnderstand', 'waiting'], to: ['openParaphrase', 'waiting'], event: 'Participator1UnderstandsYes' },
    { from: ['closedUnderstand', 'waiting'], to: ['openQuestion', 'waiting'], event: 'Participator1UnderstandsNo' },
    { from: ['openParaphrase', 'waiting'], to: ['waiting', 'closedConfirmParaphrase'], event: 'Participator1Paraphrases' },
    { from: ['waiting', 'closedConfirmParaphrase'], to: ['openSay', 'waiting'], event: 'Participator2ConfirmParaphraseYes' },
    { from: ['waiting', 'closedConfirmParaphrase'], to: ['waiting', 'openSay'], event: 'Participator2ConfirmParaphraseNo' },
    { from: ['openQuestion', 'waiting'], to: ['waiting', 'openSay'], event: 'Participator1Questions' },
    { from: ['openSay', 'waiting'], to: ['waiting', 'closedUnderstand'], event: 'Participator1Says' },

    { from: ['openSay', 'waiting'], to: ['waiting', 'closedUnderstand'], event: 'Participator1Says'},
    { from: ['waiting', 'closedUnderstand'], to: ['waiting', 'openParaphrase'], event: 'Participator2UnderstandsYes' },
    { from: ['waiting', 'closedUnderstand'], to: ['waiting', 'openQuestion'], event: 'Participator2UnderstandsNo' },
    { from: ['waiting', 'openParaphrase'], to: ['closedConfirmParaphrase', 'waiting'], event: 'Participator2Paraphrases' },
    { from: ['closedConfirmParaphrase', 'waiting'], to: ['waiting', 'openSay'], event: 'Participator1ConfirmParaphraseYes' },
    { from: ['closedConfirmParaphrase', 'waiting'], to: ['openSay', 'waiting'], event: 'Participator1ConfirmParaphraseNo' },
    { from: ['waiting', 'openQuestion'], to: ['openSay', 'waiting'], event: 'Participator2Questions' }
];

module.exports = {
    states: states,
    events: events,
    transitions: transitions,
    initialState: [states['waiting'], states['openSay']]
};