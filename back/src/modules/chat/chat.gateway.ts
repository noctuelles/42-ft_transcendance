import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Message, IMessage, ChatService } from '../chat/chat.service';

@WebSocketGateway()
export class ChatGateway {
    constructor(private readonly chatService: ChatService) {}
    @WebSocketServer() server;
    @SubscribeMessage('chat')
    async handleMessage(_: any, data: any) {
        data.user = 'Alice'; // TODO: Get user associated with this socket
        if (!this.chatService.isIMessage(data)) {
            return;
        }
        let message = new Message(data);
        this.server.clients.forEach((client: any) =>
            this.chatService.sendChatMessage(client, message),
        );
    }
}
