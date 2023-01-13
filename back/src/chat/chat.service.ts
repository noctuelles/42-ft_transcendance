import { Injectable } from '@nestjs/common';

export class Message {
    user: string;
    message: string;
    constructor(obj: IMessage) {
        this.user = obj.user;
        this.message = obj.message;
    }
}

export interface IMessage {
    user: string;
    message: string;
}

@Injectable()
export class ChatService {
    sendChatMessage(client: any, message: Message) {
        client.send(JSON.stringify({ event: 'chat', data: message }));
    }

    isIMessage(data: any) {
        return (
            typeof data?.user === 'string' && typeof data?.message === 'string'
        );
    }
}
