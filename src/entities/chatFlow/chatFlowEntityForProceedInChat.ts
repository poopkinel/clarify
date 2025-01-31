import ChatFlowGetNextStateResult from "../../dataModels/current/chatFlow/chatFlowGetNextStateResult";

export default interface ChatFlowEntityForProceedInChat {
    tryGetNextState(currentStateId: string, proceedEvent: string): Promise<ChatFlowGetNextStateResult>;
};