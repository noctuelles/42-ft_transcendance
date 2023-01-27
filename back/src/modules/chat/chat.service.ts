import { Injectable } from '@nestjs/common';
import { WebsocketsService } from '../websockets/websockets.service';
import Channel from './Channel';
import { ChannelType, IPunishment } from './Channel';

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

@Injectable()
export class ChatService {
	private channels: Map<number, Channel> = new Map([
		[1, new Channel(1, 'Channel 1', ChannelType.PUBLIC, 3)],
		[2, new Channel(2, 'Channel 2', ChannelType.PUBLIC, 3)],
		[3, new Channel(3, 'Channel 3', ChannelType.PUBLIC, 3)],
		[4, new Channel(4, 'Channel 4', ChannelType.PUBLIC, 3)],
	]);
	constructor(private readonly websocketsService: WebsocketsService) {}

	sendMessage(message: IMessage, channelId: number): void {
		this.websocketsService.sendToAllUsers(
			this.channels.get(channelId).membersId,
			'chat',
			message,
		);
	}

	getChannel(channelId: number): Channel | undefined {
		return this.channels.get(channelId);
	}

	isIMessage(data: any) {
		return (
			typeof data?.username === 'string' &&
			typeof data?.message === 'string'
		);
	}

	channelExists(channelId: number) {
		return [...this.channels.keys()].includes(channelId);
	}

	sendChannelListToSocket(socket: any): void {
		this.websocketsService.send(
			socket,
			'channels',
			[...this.channels.values()].map((channel) => {
				let { muted, banned, ...frontChannel } = channel;
				return frontChannel;
			}),
		);
	}

	sendChannelListToUser(userId: number) {
		this.sendChannelListToSocket(
			this.websocketsService.getSocketsFromUsersId([userId])[0],
		);
	}

	addUserToChannel(userId: number, channelId: number): boolean {
		if (!this.channelExists(channelId)) {
			return false;
		}
		const ret = this.channels.get(channelId).addUser(userId);
		if (ret) {
			this.sendChannelListToSocket(
				this.websocketsService.getSocketsFromUsersId([userId])[0],
			);
		}
		// TODO: Check password
		return ret;
	}

	isUserBannedFromChannel(userId: number, channelId: number) {
		this.purgeEndedPunishment(this.channels.get(channelId).banned);
		return this.channels.get(channelId).banned.some((bannedInfos) => {
			return bannedInfos.userId === userId;
		});
	}

	purgeEndedPunishment(punishments: IPunishment[]) {
		for (let i = punishments.length - 1; i >= 0; i--) {
			if (punishments[i].endDate < new Date(Date.now()))
				punishments.splice(i, 1);
		}
	}
}
