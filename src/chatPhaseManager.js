const { phases } = require('./Phase');

const { waiting, openSay, closedUnderstand, openParaphrase, closedConfirmParaphrase, openQuestion } = phases;

const transitions = [
    { from: [waiting, openSay], to: [closedUnderstand, waiting], event: 'Participator2Says' },
    { from: [closedUnderstand, waiting], to: [openParaphrase, waiting], event: 'Participator1UnderstandsYes' },
    { from: [closedUnderstand, waiting], to: [openQuestion, waiting], event: 'Participator1UnderstandsNo' },
    { from: [openParaphrase, waiting], to: [waiting, closedConfirmParaphrase], event: 'Participator1Paraphrases' },
    { from: [waiting, closedConfirmParaphrase], to: [openSay, waiting], event: 'Participator2ConfirmParaphraseYes' },
    { from: [waiting, closedConfirmParaphrase], to: [waiting, openSay], event: 'Participator2ConfirmParaphraseNo' },
    { from: [openQuestion, waiting], to: [waiting, openSay], event: 'Participator1Questions' },
    { from: [openSay, waiting], to: [waiting, closedUnderstand], event: 'Participator1Says' },

    { from: [openSay, waiting], to: [waiting, closedUnderstand], event: 'Participator1Says'},
    { from: [waiting, closedUnderstand], to: [waiting, openParaphrase], event: 'Participator2UnderstandsYes' },
    { from: [waiting, closedUnderstand], to: [waiting, openQuestion], event: 'Participator2UnderstandsNo' },
    { from: [waiting, openParaphrase], to: [closedConfirmParaphrase, waiting], event: 'Participator2Paraphrases' },
    { from: [closedConfirmParaphrase, waiting], to: [waiting, openSay], event: 'Participator1ConfirmParaphraseYes' },
    { from: [closedConfirmParaphrase, waiting], to: [openSay, waiting], event: 'Participator1ConfirmParaphraseNo' },
    { from: [waiting, openQuestion], to: [openSay, waiting], event: 'Participator2Questions' }
];

const makePhaseTransition = (currentPhase, fromChatEvent) => {
    for (var i = 0; i < transitions.length; i++) {
        const from = transitions[i].from;
        const modelEvent = transitions[i].event;
        console.log({'from': from, 'currentPhase': currentPhase, 'modelEvent': modelEvent, 'fromChatEvent': fromChatEvent})
        if (from[0].key == currentPhase[0].key && from[1].key == currentPhase[1].key && modelEvent == fromChatEvent) {
            console.log('found match');
            return ({
                'nextPhases' : {
                    'p1' : {
                        'key': transitions[i].to[0].key,
                        'prompt': transitions[i].to[0].prompt
                    },
                    'p2': {
                        'key': transitions[i].to[1].key,
                        'prompt': transitions[i].to[1].prompt
                    }
                }
            });
        }
    }
    return ({
        'Error': 'phase not found'
    })
}

module.exports = { makePhaseTransition };