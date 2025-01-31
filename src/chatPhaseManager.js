const makePhaseTransition = (currentPhase, event) => {
    console.log(currentPhase == ('saying', 'waiting'));
    console.log(event);
    if (currentPhase == ('saying', 'waiting') && event == 'p1-says') {
        return ({
            'nextPhase': ('waiting', 'check-understanding')
        })
    } else if (currentPhase == ('waiting', 'check-understanding') && event == 'p2-understands-yes') {
        return ({
            'nextPhase': ('waiting', 'saying')
        })
    }
    return 'Error'
}

module.exports = { makePhaseTransition };