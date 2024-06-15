import ChatFlowGetNextStateResult from "../../dataModels/current/chatFlow/chatFlowGetNextStateResult";
import ChatStateForProceedInChat from "../chatState/chatState";

export default interface ChatFlowEntityForProceedInChat {
    tryGetNextState(currentState: ChatStateForProceedInChat, proceedEvent: string): Promise<ChatFlowGetNextStateResult>;
};