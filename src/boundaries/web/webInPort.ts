export default interface WebInPort {
    createRequestModel(username: string, chatName: string): any;
    startNewChat(webStartNewChatRequestModel: any): Promise<any>;
    // getNextChatPhase(nextChatPhaseRequestModel: any): Promise<any>;
}