import ChatFlowGetNextStateResult from "../../dataModels/current/chatFlow/chatFlowGetNextStateResult";

export default interface ChatFlowEntityForProceedInChat {
    tryGetNextState(proceedEvent: string): Promise<ChatFlowGetNextStateResult>;
};