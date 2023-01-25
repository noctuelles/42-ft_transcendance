import { Injectable } from '@nestjs/common';
import { WebsocketsService } from '../websockets/websockets.service';

export class Message {
	channel: number;
	username: string;
	message: string;
	constructor(obj: IMessage) {
		this.channel = obj.channel;
		this.username = obj.username;
		this.message = obj.message;
	}
}

export interface IMessage {
	channel: number;
	username: string;
	message: string;
}

interface Channel {
	id: number;
	users: string[];
}

@Injectable()
export class ChatService {
	private channels: any = {
		1: { id: 1, users: [3, 9] },
		2: { id: 2, users: [3, 9] },
		3: { id: 3, users: [3, 9] },
		4: { id: 4, users: [-1, 9] },
	};
	constructor(private readonly websocketsService: WebsocketsService) {}

	broadcastMessage(message: Message) {
		this.websocketsService.broadcast('chat', message);
	}

	canSendToChannel(user_id: number, channel: number): boolean {
		return this.isUserInChannel(user_id, channel);
	}

	channelExists(channel: number) {
		return channel in this.channels;
	}

	isUserInChannel(user_id: number, channel: number): boolean {
		if (!this.channelExists(channel)) {
			return false;
		}
		return this.channels[channel].users.includes(user_id);
	}

	sendTo(channel: number, message: IMessage): void {
		this.websocketsService.sendToAllUsers(
			this.channels[channel].users,
			'chat',
			message,
		);
	}

	isIMessage(data: any) {
		return (
			typeof data?.username === 'string' &&
			typeof data?.message === 'string'
		);
	}
}
