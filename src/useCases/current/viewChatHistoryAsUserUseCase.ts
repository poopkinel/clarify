import ChatGatewayToViewChatHistory from "../../boundaries/gateways/chat/chatGatewayToViewChatHistory";
import UsecaseInBoundary from "../../boundaries/useCaseBoundaries/usecaseInBoundary";
import UsecaseOutBoundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ViewChatHistoryAsUserRequestModel from "../../dataModels/useCaseBoundaries/specific/viewChatHistoryAsUserRequestModel";
import ViewChatHistoryAsUserResultModel from "../../dataModels/useCaseBoundaries/specific/viewChatHistoryAsUserResultModel";

export default class ViewChatHistoryAsUserUseCase implements UsecaseInBoundary<ViewChatHistoryAsUserRequestModel>{
    private chatGateway: ChatGatewayToViewChatHistory;
    private usecaseOutBoundary: UsecaseOutBoundary<ViewChatHistoryAsUserResultModel>;

    constructor(usecaseOutBoundary: UsecaseOutBoundary<ViewChatHistoryAsUserResultModel>,
                chatGateway: ChatGatewayToViewChatHistory) {
        this.usecaseOutBoundary = usecaseOutBoundary;
        this.chatGateway = chatGateway;
    }
    async sendRequestModel(requestModel: ViewChatHistoryAsUserRequestModel): Promise<any> {
        this.executeViewChatHistory(requestModel);
    }
    async executeViewChatHistory(requestModel: ViewChatHistoryAsUserRequestModel) {
        const historyChats = await this.chatGateway.getChatHistoryById(requestModel.chatId);
        const chats = historyChats.map(chat => {
            return {
                chatId: chat.id,
                participator1UserId: chat.participator1UserId,
                participator2UserId: chat.participator2UserId,
                responses: chat.responses.map((response: any) => {
                    return {
                        text: response.text,
                        responseId: response.id,
                        responseType: response.type
                    }
                })
            }
        });
        const result = new ViewChatHistoryAsUserResultModel(
            requestModel.userId,
            chats
        );
        await this.usecaseOutBoundary.sendResultModel(result);
    }
}