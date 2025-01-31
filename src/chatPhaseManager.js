const transitions = [
    { from: ('waiting', 'openSay'), to: ('closedUnderstand', 'waiting'), event: 'Participator2Says' },
    { from: ('closedUnderstand', 'waiting'), to: ('openParaphrase', 'waiting'), event: 'Participator1UnderstandsYes' },
    { from: ('closedUnderstand', 'waiting'), to: ('openQuestion', 'waiting'), event: 'Participator1UnderstandsNo' },
    { from: ('openParaphrase', 'waiting'), to: ('waiting', 'closedConfirmParaphrase'), event: 'Participator1Paraphrases' },
    { from: ('waiting', 'closedConfirmParaphrase'), to: ('openSay', 'waiting'), event: 'Participator2ConfirmParaphraseYes' },
    { from: ('waiting', 'closedConfirmParaphrase'), to: ('waiting', 'openSay'), event: 'Participator2ConfirmParaphraseNo' },
    { from: ('openQuestion', 'waiting'), to: ('waiting', 'openSay'), event: 'Participator1Questions' },
    { from: ('openSay', 'waiting'), to: ('waiting', 'closedUnderstand'), event: 'Participator1Says' },

    { from: ('openSay', 'waiting'), to: ('waiting', 'closedUnderstand'), event: 'Participator1Says'},
    { from: ('waiting', 'closedUnderstand'), to: ('waiting', 'openParaphrase'), event: 'Participator2UnderstandsYes' },
    { from: ('waiting', 'closedUnderstand'), to: ('waiting', 'openQuestion'), event: 'Participator2UnderstandsNo' },
    { from: ('waiting', 'openParaphrase'), to: ('closedConfirmParaphrase', 'waiting'), event: 'Participator2Paraphrases' },
    { from: ('closedConfirmParaphrase', 'waiting'), to: ('waiting', 'openSay'), event: 'Participator1ConfirmParaphraseYes' },
    { from: ('closedConfirmParaphrase', 'waiting'), to: ('openSay', 'waiting'), event: 'Participator1ConfirmParaphraseNo' },
    { from: ('waiting', 'openQuestion'), to: ('openSay', 'waiting'), event: 'Participator2Questions' }
];

const makePhaseTransition = (currentPhase, event) => {
    for (var i = 0; i < transitions.length; i++) {
        if (transitions[i].from == currentPhase && transitions[i].event == event) {
            return ({
                'nextPhase' : transitions[i].to
            });
        }
    }
    return ({
        'Error': 'phase not found'
    })
}

module.exports = { makePhaseTransition };