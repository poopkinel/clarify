export default interface ChatFlowForProceedInChat {
    getNextStateId(participator1State: string, participator2State: string, proceedEvent: string): Promise<string>;
};