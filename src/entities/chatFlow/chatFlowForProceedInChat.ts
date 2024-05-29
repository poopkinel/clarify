export default interface ChatFlowForProceedInChat {
    getNextState(participator1State: string, participator2State: string, proceedEvent: string): Promise<string>;
};