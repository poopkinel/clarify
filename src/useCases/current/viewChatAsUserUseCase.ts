import ChatGatewayToViewChat from "../../boundaries/gateways/chat/chatGatewayToViewChat";
import UsercaseOutboundary from "../../boundaries/useCaseBoundaries/usecaseOutBoundary";
import ViewChatResultModel from "../../dataModels/useCaseBoundaries/specific/viewChatResultModel";
import ViewChatRequestModel from "../../dataModels/useCaseBoundaries/specific/viewChatRequestModel";

export default class ViewChatAsUserUseCase {
    chatGatewayToViewChatHistory: ChatGatewayToViewChat;
    usecaseOutboundary: UsercaseOutboundary<ViewChatResultModel>;

    constructor(chatGatewayToViewChatHistory: ChatGatewayToViewChat,
                usecaseOutboundary: UsercaseOutboundary<ViewChatResultModel>) {
        this.chatGatewayToViewChatHistory = chatGatewayToViewChatHistory;
        this.usecaseOutboundary = usecaseOutboundary;
    }

    async viewChatAsUser(requestModel: ViewChatRequestModel) {
        const chat = await this.chatGatewayToViewChatHistory.getChatById(requestModel.chatId);
        const result = new ViewChatResultModel(
            chat.id,
            chat.participator1UserId,
            chat.participator2UserId,
            chat.name,
            chat.access,
            chat.responses.map(response => {
                return {
                    text: response.text,
                    responseId: response.id,
                    responseType: response.type
                }
            })
        )
        await this.usecaseOutboundary.sendResultModel(result);
    }
}