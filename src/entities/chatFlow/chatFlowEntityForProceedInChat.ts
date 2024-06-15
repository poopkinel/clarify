import ChatFlowGetNextStateResult from "../../dataModels/current/chatFlow/chatFlowGetNextStateResult";
import ChatStateForProceedInChat from "../chatState/ChatStateForProceedInChat";

export default interface ChatFlowEntityForProceedInChat {
    tryGetNextState(currentState: ChatStateForProceedInChat, proceedEvent: string): Promise<ChatFlowGetNextStateResult>;
};