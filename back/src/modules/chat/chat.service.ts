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

	async sendChannelListWhereUserIsToSocket(
		socket: any,
		userId: number,
	): Promise<void> {
		const channels = await this.getChannelWehreUserIs(userId);
		this.websocketsService.send(
			socket,
			'channels',
			channels.map((channel) => {
				let { muted, banned, ...frontChannel } = channel;
				return frontChannel;
			}),
		);
	}

	async getChannelWehreUserIs(userId: number): Promise<Channel[]> {
		const rawChannelList = await this.prismaService.userChannel.findMany({
			where: {
				participants: {
					some: {
						userId: userId,
					},
				},
			},
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

	sendChannelListWhereUserIs(userId: number) {
		this.sendChannelListWhereUserIsToSocket(
			this.websocketsService.getSocketsFromUsersId([userId])[0],
			userId,
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
