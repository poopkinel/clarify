class Phase {
    constructor(k, p, opts = []) {
        this.key = k;
        this.prompt = p;
        this.options = opts
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
    // Participator1FocusOneThing: 'Participator1FocusOneThing',
    // Participator2FocusOneThing: 'Participator2FocusOneThing',
    
    // Participator1UnderstandsYes: 'Participator1UnderstandsYes',
    // Participator1UnderstandsNo: 'Participator1UnderstandsNo',

    // Participator1Paraphrases: 'Participator1Paraphrases',
    // Participator2Paraphrases: 'Participator2Paraphrases',
    // Participator1ConfirmParaphraseYes: 'Participator1ConfirmParaphraseYes',
    // Participator1ConfirmParaphraseNo: 'Participator1ConfirmParaphraseNo',
    // Participator2ConfirmParaphraseYes: 'Participator2ConfirmParaphraseYes',
    // Participator2ConfirmParaphraseNo: 'Participator2ConfirmParaphraseNo',

    InputTextQuestionParticipant1: InputTextQuestionParticipant1,
    InputTextQuestionParticipant2: InputTextQuestionParticipant2
}

class ChatOption {
    constructor(opts) {
        this.options = opts
    }
}

const didISayOptions = new ChatOption([
    {
        option: 'Yes',
        event: {
            eventKey: chatEvents.Participator1SaysOneThing,
        }
    },
    {
        option: 'No', 
        event: chatEvents.Participator1SaysManyThings
    }
])

const waiting = new Phase('waiting', 'Waiting for response');
const openSay = new Phase('openSay', 'I can write what I want to say');
const didISayOne = new Phase('didISayOne', 'Did I just focus on one thing to talk about?', didISayOptions);
const focusOneThing = new Phase('focusOneThing', 'Please choose one thing to focus on first');
const didUnderstand = new Phase('didUnderstand', 'I answer "Yes" if I understand the other side, or "No" otherwise');
const openParaphrase = new Phase('openParaphrase', 'I write what the other side said in my own words');
const closedConfirmParaphrase = new Phase('closedConfirmParaphrase', 'I confirm with "Yes" or reject with "No"');
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