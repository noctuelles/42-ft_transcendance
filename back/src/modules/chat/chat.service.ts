import { Injectable } from '@nestjs/common';
import { WebsocketsService } from '../websockets/websockets.service';
import Channel from './Channel';
import { PrismaService } from '../prisma/prisma.service';
import { UserChannel } from '@prisma/client';
import { UserOnChannel } from '@prisma/client';

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
	constructor(
		private readonly websocketsService: WebsocketsService,
		private readonly prismaService: PrismaService,
	) {}

	async sendMessage(message: IMessage, channelId: number): Promise<void> {
		const channel: Channel = await this.getChannel(channelId);
		this.websocketsService.sendToAllUsers(
			channel.membersId,
			'chat',
			message,
		);
	}

	async getChannel(channelId: number): Promise<Channel | undefined> {
		const chann = new Channel(channelId);
		chann.convertFromUserChannel(
			await this.prismaService.userChannel.findUnique({
				where: { id: channelId },
				include: { participants: true },
			}),
		);
		return chann;
	}

	isIMessage(data: any) {
		return (
			typeof data?.username === 'string' &&
			typeof data?.message === 'string'
		);
	}

	channelExists(channelId: number) {
		return (
			this.prismaService.userChannel.findUnique({
				where: { id: channelId },
			}) !== null
		);
	}

	async sendChannelListToSocket(socket: any): Promise<void> {
		const channels = await this.getChannelList();
		this.websocketsService.send(
			socket,
			'channels',
			channels.map((channel) => {
				let { muted, banned, ...frontChannel } = channel;
				return frontChannel;
			}),
		);
	}

	async getChannelList(): Promise<Channel[]> {
		const rawChannelList: (UserChannel & {
			participants: UserOnChannel[];
		})[] = await this.prismaService.userChannel.findMany({
			include: {
				participants: true,
			},
		});
		return rawChannelList.map((rawChannel) => {
			const channel = new Channel(rawChannel.id);
			channel.convertFromUserChannel(rawChannel);
			return channel;
		});
	}

	sendChannelListToUser(userId: number) {
		this.sendChannelListToSocket(
			this.websocketsService.getSocketsFromUsersId([userId])[0],
		);
	}

	async getPublicChannels(user) {
		const channels = await this.prismaService.userChannel.findMany({
			where: { visibility: 'PUBLIC' },
			include: {
				participants: true,
			},
		});
		return channels
			.map((channel) => {
				return {
					id: channel.id,
					name: channel.name,
					members: channel.participants.length,
					joined: channel.participants.find(
						(p) => p.userId === user.id,
					)
						? true
						: false,
				};
			})
			.sort((a, b) => {
				if (a.joined == b.joined) return b.members - a.members;
				return a.joined ? 1 : -1;
			});
	}
}
