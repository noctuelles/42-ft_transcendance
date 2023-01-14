import { Injectable } from '@nestjs/common';
import { WebsocketsService } from '../websockets/websockets.service';

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
	constructor(private readonly websocketsService: WebsocketsService) {}

	sendChatMessageToAll(message: Message) {
		this.websocketsService.broadcast('chat', message);
	}

	isIMessage(data: any) {
		return (
			typeof data?.user === 'string' && typeof data?.message === 'string'
		);
	}
}
