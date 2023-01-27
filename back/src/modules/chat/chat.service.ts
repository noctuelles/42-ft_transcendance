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
	admins: number[];
	muted: IPunishment[];
	banned: IPunishment[];
}

interface IPunishment {
	userId: number;
	endDate: Date;
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
				admins: [] as number[],
				muted: [] as IPunishment[],
				banned: [] as IPunishment[],
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
				admins: [] as number[],
				muted: [] as IPunishment[],
				banned: [] as IPunishment[],
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
				admins: [] as number[],
				muted: [] as IPunishment[],
				banned: [] as IPunishment[],
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
				admins: [] as number[],
				muted: [] as IPunishment[],
				banned: [] as IPunishment[],
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

	addUserInChannel(userId: number, channelId: number): boolean {
		if (
			!this.channelExists(channelId) ||
			this.isUserInChannel(userId, channelId)
		) {
			return false;
		}
		this.channels.get(channelId).members.push(userId);
		this.sendChannelListToSocket(
			this.websocketsService.getSocketsFromUsers([userId])[0],
		);
		return true;
	}

	isUserAllowedToJoinChannel(
		userId: number,
		channelId: number,
		password: string,
	): boolean {
		if (!this.channelExists(channelId)) {
			return false;
		}
		if (this.channels.get(channelId).type === ChannelType.PRIVATE)
			return false;
		if (this.isUserBannedFromChannel(userId, channelId)) {
			return false;
		}
		// TODO: Check password
		return true;
	}

	isUserBannedFromChannel(userId: number, channelId: number) {
		return this.channels.get(channelId).banned.some((bannedInfos) => {
			bannedInfos.userId === userId;
		});
	}
}
