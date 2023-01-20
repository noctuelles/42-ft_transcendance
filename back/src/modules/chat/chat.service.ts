import { Injectable } from '@nestjs/common';
import { WebsocketsService } from '../websockets/websockets.service';

export class Message {
	channel: number;
	user: string;
	message: string;
	constructor(obj: IMessage) {
		this.channel = obj.channel;
		this.user = obj.user;
		this.message = obj.message;
	}
}

export interface IMessage {
	channel: number;
	user: string;
	message: string;
}

interface Channel {
	id: number;
	users: string[];
}

@Injectable()
export class ChatService {
	private channels: any = {
		1: { id: 1, users: ['jmaia', 'bob'] },
		2: { id: 2, users: ['jmaia', 'bob'] },
		3: { id: 3, users: ['jmaia', 'bob'] },
		4: { id: 4, users: ['not-jmaia', 'bob'] },
	};
	constructor(private readonly websocketsService: WebsocketsService) {}

	broadcastMessage(message: Message) {
		this.websocketsService.broadcast('chat', message);
	}

	canSendToChannel(user: string, channel: number): boolean {
		return this.isUserInChannel(user, channel);
	}

	channelExists(channel: number) {
		return channel in this.channels;
	}

	isUserInChannel(user: string, channel: number): boolean {
		if (!this.channelExists(channel)) {
			return false;
		}
		return this.channels[channel].users.includes(user);
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
			typeof data?.user === 'string' && typeof data?.message === 'string'
		);
	}
}
