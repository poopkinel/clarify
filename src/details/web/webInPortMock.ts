import WebInPort from "../../boundaries/web/webInPort";

export default class WebInPortMock implements WebInPort {
    constructor() {
    }
    createRequestModel(username: string, chatName: string) {
        
    }
    async startNewChat(webStartNewChatRequestModel: any): Promise<any> {
        return "MOCKED RESULT";
    }
}