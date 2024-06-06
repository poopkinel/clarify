import ChatGatewayToProceedInChat from "../../boundaries/gateways/chat/chatGatewayToProceedInChat";
import ChatFlowGatewayToProceedInChat from "../../boundaries/gateways/chatFlow/chatFlowGatewayToProceedInChat";
import ResponseValidationGateway from "../../boundaries/gateways/responseValidation/responseValidationGateway";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ChatFlowGetNextStateResult from "../../dataModels/current/chatFlow/chatFlowGetNextStateResult";
import ChatGatewayCreateChatResultModel from "../../dataModels/current/chatGateway/chatGatewayCreateChatResultModel";
import ProceedInChatRequestModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatRequestModel";
import ProceedInChatResultModel from "../../dataModels/useCaseBoundaries/specific/proceedInChatResultModel";
import ChatEntityForProceedInChat from "../../entities/chatEntity/chatEntityForProceedInChat";

const firstParticipatorIdInChat = 1;
const secondParticipatorIdInChat = 2;

export default class ProceedInChatUseCase {
    private usecaseOutBoundary: UsecaseOutBoundary<ProceedInChatResultModel>;
    private chatGatewayToProceedInChat: ChatGatewayToProceedInChat;
    private chatFlowGateway: ChatFlowGatewayToProceedInChat;
    private validationGateway: ResponseValidationGateway;
    constructor(
        usecaseOutBoundary: UsecaseOutBoundary<ProceedInChatResultModel>, 
        chatGatewayToProceedInChat: ChatGatewayToProceedInChat,
        chatFlowGateway: ChatFlowGatewayToProceedInChat,
        validationGateway: ResponseValidationGateway
    ) {
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.chatGatewayToProceedInChat = chatGatewayToProceedInChat;
        this.chatFlowGateway = chatFlowGateway;
        this.validationGateway = validationGateway;
    }

    async executeProceedInChat(requestModel: ProceedInChatRequestModel) {
        var errors: string[] = [];
        const { eventValidationResult, chat } = await this.trySetupCatchErrors(requestModel, errors); 
        
        var { responseOptionsResult, nextStateResult } = await this.tryNextStateCatchErrors(chat, eventValidationResult, errors);
        responseOptionsResult = this.extractResponseOptions(chat, requestModel, responseOptionsResult, nextStateResult);
        
        var result: ProceedInChatResultModel;

        const isError = errors.length != 0;
        if (isError) {
            result = await this.sendErrorResult(errors);
            return;
        }

        result = await this.sendSuccessResult(errors, nextStateResult, responseOptionsResult);
    }

    private async sendSuccessResult(errors: string[], nextStateResult: ChatFlowGetNextStateResult, responseOptionsResult: { options: { responseMedia: string; responseRestrictions: string; }[]; }) {
        var result = new ProceedInChatResultModel(errors, nextStateResult.nextState.id);
        result.setResponseOptions(responseOptionsResult);

        await this.usecaseOutBoundary.sendResultModel(result);
        return result;
    }

    private async sendErrorResult(errors: string[]) {
        var result = new ProceedInChatResultModel(errors, '');
        await this.usecaseOutBoundary.sendResultModel(result);
        return result;
    }

    private extractResponseOptions(chat: ChatEntityForProceedInChat, requestModel: ProceedInChatRequestModel, responseOptionsResult: { options: { responseMedia: string; responseRestrictions: string; }[]; }, nextStateResult: ChatFlowGetNextStateResult) {
        if (chat.participator1UserId === requestModel.userId) {
            responseOptionsResult = this.extractOptionsResult(firstParticipatorIdInChat, nextStateResult);
        } else {
            responseOptionsResult = this.extractOptionsResult(secondParticipatorIdInChat, nextStateResult);
        }
        return responseOptionsResult;
    }

    private async tryNextStateCatchErrors(
        chat: ChatEntityForProceedInChat,
        eventValidationResult: { success: boolean; error: string; event: string; }, errors: string[],
    ) {
        var responseOptionsResult = {
            options: [] as {
                responseMedia: string;
                responseRestrictions: string;
            }[]
        };

        const chatFlow = await this.chatFlowGateway.getChatFlowById(chat.chatFlowId);
        const nextStateResult = await chatFlow.tryGetNextState(chat.currentState, eventValidationResult.event);
        this.catchNextStateResultErrors(nextStateResult, errors, eventValidationResult);
        return { responseOptionsResult, nextStateResult };
    }

    private async trySetupCatchErrors(requestModel: ProceedInChatRequestModel, errors: string[]) {
        const chatGatewayResultModel = await this.chatGatewayToProceedInChat.getChatById(requestModel.chatId);
        this.catchChatGatewayErrors(chatGatewayResultModel, errors, requestModel);

        const response = requestModel.stateInput.response;
        const eventValidationResult = await this.validationGateway.validateResponse(response);
        
        const chat = chatGatewayResultModel.chat;
        this.catchValidationResultErrors(eventValidationResult, errors, chat);

        this.catchReponseErrors(response, errors);
        return { eventValidationResult, chat };
    }

    private catchNextStateResultErrors(nextStateResult: ChatFlowGetNextStateResult, errors: string[], eventValidationResult: { success: boolean; error: string; event: string; }) {
        if (!nextStateResult.success) {
            errors.push(nextStateResult.error);
        } else if (nextStateResult.nextState.proceedEvent !== eventValidationResult.event) { // Validate event
            errors.push('Invalid chat state event');
        }
    }

    private catchReponseErrors(response: { responseMedia: string; responseContent: string; }, errors: string[]) {
        if (!response) {
            errors.push('Invalid state input response');
        }
    }

    private catchValidationResultErrors(eventValidationResult: { success: boolean; error: string; event: string; }, errors: string[], chat: ChatEntityForProceedInChat) {
        if (!eventValidationResult.success) {
            errors.push(eventValidationResult.error);
        }
    }

    private catchChatGatewayErrors(chatGatewayResultModel: ChatGatewayCreateChatResultModel, errors: string[], requestModel: ProceedInChatRequestModel) {
        const chat = chatGatewayResultModel.chat;
        if (!chatGatewayResultModel.success || chat === null) {
            errors.push(chatGatewayResultModel.error);
        }
        if (!chat.currentState) {
            errors.push('Invalid chat current state object');
        }
        if (chat.participator1UserId !== requestModel.userId &&
            chat.participator2UserId !== requestModel.userId) {
            errors.push('User is not a participator in this chat');
        }
    }

    private extractOptionsResult(participatorIdInChat: number, nextStateResult: ChatFlowGetNextStateResult) {
        var responseOptionsResult;

        if (participatorIdInChat === 1) {
            if (nextStateResult.nextState.participator1Options.options === null) {
                responseOptionsResult = {
                    options: [] as {
                        responseMedia: string;
                        responseRestrictions: string;
                    }[]
                };
            } else {
                responseOptionsResult = {
                    options: nextStateResult.nextState.participator1Options.options.map((option) => {
                        return {
                            responseMedia: option.responseMedia.media,
                            responseRestrictions: option.responseRestrictions.validatorId
                        };
                    })
                };
            }
        } else if (participatorIdInChat === 2) {
            if (nextStateResult.nextState.participator2Options.options === null) {
                responseOptionsResult = {
                    options: [] as {
                        responseMedia: string;
                        responseRestrictions: string;
                    }[]
                };
            } else {
                responseOptionsResult = {
                    options: nextStateResult.nextState.participator2Options.options.map((option) => {
                        return {
                            responseMedia: option.responseMedia.media,
                            responseRestrictions: option.responseRestrictions.validatorId
                        };
                    })
                };
            }
        } else {
            responseOptionsResult = {
                options: [] as {
                    responseMedia: string;
                    responseRestrictions: string;
                }[]
            };
        }
        return responseOptionsResult;
    }

    static fromJson(json: any): ProceedInChatUseCase {
        return new ProceedInChatUseCase(
            json.usecaseOutBoundary, 
            json.chatGatewayToProceedInChat, 
            json.chatFlowGateway,
            json.validationGateway
        );
    }
}