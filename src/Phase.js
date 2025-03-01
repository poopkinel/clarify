class Phase {
    constructor(k, p, opts = []) {
        this.key = k;
        this.prompt = p;
        this.responseOptions = opts
    }
}

class ChatEvent {
    constructor(k, p) {
        this.key = k;
        this.participant = p;
    }
}

const InputTextParticipant1 = new ChatEvent('InputText', 'p1');
const InputTextParticipant2 = new ChatEvent('InputText', 'p2');
const InputOption1Participant1 = new ChatEvent('InputOption1', 'p1')
const InputOption1Participant2 = new ChatEvent('InputOption1', 'p2')
const InputOption2Participant1 = new ChatEvent('InputOption2', 'p1')
const InputOption2Participant2 = new ChatEvent('InputOption2', 'p2')
const InputTextQuestionParticipant1 = new ChatEvent('InputTextQuestion', 'p1');
const InputTextQuestionParticipant2 = new ChatEvent('InputTextQuestion', 'p2');

const chatEvents = {
    InputTextParticipant1: InputTextParticipant1,
    InputTextParticipant2: InputTextParticipant2,
    InputOption1Participant1: InputOption1Participant1,
    InputOption1Participant2: InputOption1Participant2,
    InputOption2Participant1: InputOption2Participant1,
    InputOption2Participant2: InputOption2Participant2,
    InputTextQuestionParticipant1: InputTextQuestionParticipant1,
    InputTextQuestionParticipant2: InputTextQuestionParticipant2
}


const yesNoOptions = [
    'Yes', 'No'
]

const waiting = new Phase('waiting', 'Waiting for response', []);
const openSay = new Phase('openSay', 'I can write what I want to say', []);
const didISayOne = new Phase('didISayOne', 'Did I just focus on one thing to talk about?', yesNoOptions);
const focusOneThing = new Phase('focusOneThing', 'Please choose one thing to focus on first');
const didUnderstand = new Phase('didUnderstand', 'I answer "Yes" if I understand the other side, or "No" otherwise', yesNoOptions);
const openParaphrase = new Phase('openParaphrase', 'I write what the other side said in my own words');
const closedConfirmParaphrase = new Phase('closedConfirmParaphrase', 'I confirm with "Yes" or reject with "No"', yesNoOptions);
const openQuestion = new Phase('openQuestion', 'I ask a question to better understand the other side');

const phases = {
    waiting: waiting,
    openSay: openSay,
    didUnderstand: didUnderstand,
    openParaphrase: openParaphrase,
    closedConfirmParaphrase: closedConfirmParaphrase,
    openQuestion: openQuestion,
    didISayOne: didISayOne,
    focusOneThing: focusOneThing,
}

module.exports = { Phase, phases, chatEvents };