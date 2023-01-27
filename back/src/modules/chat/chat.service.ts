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
	name: string;
	type: ChannelType;
	owner_id: number;
	members: number[];
}

enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}

@Injectable()
export class ChatService {
	private channels: Map<number, Channel> = new Map([
		[
			1,
			{
				id: 1,
				name: 'Channel 1',
				type: ChannelType.PUBLIC,
				owner_id: 3,
				members: [3, 9],
			},
		],
		[
			2,
			{
				id: 2,
				name: 'Channel 2',
				type: ChannelType.PUBLIC,
				owner_id: 3,
				members: [3, 9],
			},
		],
		[
			3,
			{
				id: 3,
				name: 'Channel 3',
				type: ChannelType.PUBLIC,
				owner_id: 3,
				members: [3, 9],
			},
		],
		[
			4,
			{
				id: 4,
				name: 'Channel 4',
				type: ChannelType.PUBLIC,
				owner_id: 3,
				members: [-1, 9],
			},
		],
	]);
	constructor(private readonly websocketsService: WebsocketsService) {}

	broadcastMessage(message: Message) {
		this.websocketsService.broadcast('chat', message);
	}

	canSendToChannel(user_id: number, channel: number): boolean {
		return this.isUserInChannel(user_id, channel);
	}

	channelExists(channel: number) {
		return [...this.channels.keys()].includes(channel);
	}

	isUserInChannel(user_id: number, channel: number): boolean {
		if (!this.channelExists(channel)) {
			return false;
		}
		return this.channels.get(channel).members.includes(user_id);
	}

	sendTo(channel: number, message: IMessage): void {
		this.websocketsService.sendToAllUsers(
			this.channels.get(channel).members,
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

	sendChannelListToSocket(socket: any): void {
		this.websocketsService.send(socket, 'channels', [
			...this.channels.values(),
		]);
	}
}
