class Phase {
    constructor(k, p) {
        this.key = k;
        this.prompt = p;
    }
}

const waiting = new Phase('waiting', 'Waiting for response');
const openSay = new Phase('openSay', 'I can write what I want to say');
const closedUnderstand = new Phase('closedUnderstand', 'I answer "Yes" if I understand the other side, or "No" otherwise');
const openParaphrase = new Phase('openParaphrase', 'I say what I understand, in my own words');
const closedConfirmParaphrase = new Phase('closedConfirmParaphrase', 'I confirm with "Yes" or reject with "No"');
const openQuestion = new Phase('openQuestion', 'I ask a question to better understand the other side');

const phases = {
    waiting: waiting,
    openSay: openSay,
    closedUnderstand: closedUnderstand,
    openParaphrase: openParaphrase,
    closedConfirmParaphrase: closedConfirmParaphrase,
    openQuestion: openQuestion,
}

module.exports = { Phase, phases };