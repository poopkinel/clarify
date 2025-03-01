const { phases, chatEvents } = require('./Phase');

const { waiting, openSay, didUnderstand, openParaphrase, closedConfirmParaphrase, openQuestion, 
    didISayOne, focusOneThing } = phases;

// const clarity1 = [
//     { from: [waiting, openSay], to: [didUnderstand, waiting], event: 'Participator2Says' },
//     { from: [didUnderstand, waiting], to: [openParaphrase, waiting], event: 'Participator1UnderstandsYes' },
//     { from: [didUnderstand, waiting], to: [openQuestion, waiting], event: 'Participator1UnderstandsNo' },
//     { from: [openParaphrase, waiting], to: [waiting, closedConfirmParaphrase], event: 'Participator1Paraphrases' },
//     { from: [waiting, closedConfirmParaphrase], to: [openSay, waiting], event: 'Participator2ConfirmParaphraseYes' },
//     { from: [waiting, closedConfirmParaphrase], to: [waiting, openSay], event: 'Participator2ConfirmParaphraseNo' },
//     { from: [openQuestion, waiting], to: [waiting, openSay], event: 'Participator1Questions' },
//     { from: [openSay, waiting], to: [waiting, didUnderstand], event: 'Participator1Says' },

//     { from: [openSay, waiting], to: [waiting, didUnderstand], event: 'Participator1Says'},
//     { from: [waiting, didUnderstand], to: [waiting, openParaphrase], event: 'Participator2UnderstandsYes' },
//     { from: [waiting, didUnderstand], to: [waiting, openQuestion], event: 'Participator2UnderstandsNo' },
//     { from: [waiting, openParaphrase], to: [closedConfirmParaphrase, waiting], event: 'Participator2Paraphrases' },
//     { from: [closedConfirmParaphrase, waiting], to: [waiting, openSay], event: 'Participator1ConfirmParaphraseYes' },
//     { from: [closedConfirmParaphrase, waiting], to: [openSay, waiting], event: 'Participator1ConfirmParaphraseNo' },
//     { from: [waiting, openQuestion], to: [openSay, waiting], event: 'Participator2Questions' }
// ];

const transitions = [
    { from: [openSay, waiting], to: [didISayOne, waiting], event: chatEvents.InputTextParticipant1 },
    { from: [didISayOne, waiting], to: [waiting, didUnderstand], event: chatEvents.InputOption1Participant1 },
    { from: [didISayOne, waiting], to: [focusOneThing, waiting], event: chatEvents.InputOption2Participant1 },
    { from: [focusOneThing, waiting], to: [waiting, didUnderstand], event: chatEvents.InputTextParticipant1 },

    { from: [waiting, didUnderstand], to: [waiting, openParaphrase], event: chatEvents.InputOption1Participant2 },
    { from: [waiting, didUnderstand], to: [waiting, openQuestion], event: chatEvents.InputOption2Participant2 },
    { from: [waiting, openParaphrase], to: [closedConfirmParaphrase, waiting], event: chatEvents.InputTextParticipant2 },
    { from: [closedConfirmParaphrase, waiting], to: [waiting, openSay], event: chatEvents.InputOption1Participant1 },
    { from: [closedConfirmParaphrase, waiting], to: [openSay, waiting], event: chatEvents.InputOption2Participant1 },
    { from: [waiting, openQuestion], to: [openSay, waiting], event: chatEvents.InputTextQuestionParticipant2 },

    { from: [waiting, openSay], to: [waiting, didISayOne], event: chatEvents.InputTextParticipant2 },
    { from: [waiting, didISayOne], to: [didUnderstand, waiting], event: chatEvents.InputOption1Participant2 },
    { from: [waiting, didISayOne], to: [waiting, focusOneThing], event: chatEvents.InputOption2Participant2 },
    { from: [waiting, focusOneThing], to: [didUnderstand, waiting], event: chatEvents.InputTextParticipant2 },

    { from: [didUnderstand, waiting], to: [openParaphrase, waiting], event: chatEvents.InputOption1Participant1 },
    { from: [didUnderstand, waiting], to: [openQuestion, waiting], event: chatEvents.InputOption2Participant1 },
    { from: [openParaphrase, waiting], to: [waiting, closedConfirmParaphrase], event: chatEvents.InputTextParticipant1 },
    { from: [waiting, closedConfirmParaphrase], to: [openSay, waiting], event: chatEvents.InputOption1Participant2 },
    { from: [waiting, closedConfirmParaphrase], to: [waiting, openSay], event: chatEvents.InputOption2Participant2 },
    { from: [openQuestion, waiting], to: [waiting, openSay], event: chatEvents.InputTextQuestionParticipant1 },
];

const makePhaseTransition = (currentPhase, fromChatEvent) => {
    for (var i = 0; i < transitions.length; i++) {
        const from = transitions[i].from;
        const modelEvent = transitions[i].event;
        console.log({'from': from, 'currentPhase': currentPhase, 'modelEvent': modelEvent, 'fromChatEvent': fromChatEvent})
        if (from[0].key == currentPhase[0].key && from[1].key == currentPhase[1].key && 
            modelEvent.key == fromChatEvent.key && modelEvent.participant == fromChatEvent.participant) {
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
    return (
        'Error'
    )
}

module.exports = { makePhaseTransition };