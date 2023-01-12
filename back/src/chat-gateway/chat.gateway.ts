import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

function sendChatMessage(client: any, message: Message) {
    client.send(JSON.stringify({ event: 'chat', data: message }));
}

function isIMessage(data: any) {
    return typeof data?.user === 'string' && typeof data?.message === 'string';
}

class Message {
    user: string;
    message: string;
    constructor(obj: IMessage) {
        this.user = obj.user;
        this.message = obj.message;
    }
}

interface IMessage {
    user: string;
    message: string;
}

@WebSocketGateway()
export class ChatGateway {
    @WebSocketServer() server;
    @SubscribeMessage('chat')
    async handleMessage(_: any, data: any) {
        if (!isIMessage(data)) {
            return;
        }
        let message = new Message(data);
        this.server.clients.forEach((client: any) =>
            sendChatMessage(client, message),
        );
    }
}
