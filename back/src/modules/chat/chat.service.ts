import { BadRequestException, Injectable } from '@nestjs/common';
import { WebsocketsService } from '../websockets/websockets.service';
import Channel, { IMessage } from './Channel';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserChannelVisibility, UserOnChannelRole } from '@prisma/client';
import { CreateChannelDTO, EChannelType } from './Channel.dto';
import * as argon from 'argon2';

export class Message {
	channel: number;
	username: string;
	message: string;
	isInvitation: boolean;
	constructor(obj: IMessage) {
		this.channel = obj.channel;
		this.username = obj.username;
		this.message = obj.message;
		this.isInvitation = obj.isInvitation;
	}
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
		const sender = await this.prismaService.user.findUnique({
			where: { name: message.username },
		});
		await this.prismaService.messageOnChannel.create({
			data: {
				channelId: channelId,
				authorId: sender.id,
				content: message.message,
			},
		});
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
		const channelsForFront = await Promise.all(
			channels.map(async (channel) => {
				let { muted, banned, hashedPwd, members, ...frontChannel } =
					channel;
				const unreaded =
					await this.prismaService.messageOnChannel.count({
						where: {
							channelId: channel.id,
							id: {
								gt: channel.members.find(
									(u) => u.userId === userId,
								).lastReadedMessage,
							},
						},
					});
				frontChannel['unreaded'] = unreaded;
				return frontChannel;
			}),
		);
		this.websocketsService.send(socket, 'channels', channelsForFront);
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

	async getChannelsAvailableForUser(
		user,
		channelVisibility: UserChannelVisibility,
	) {
		let channels = [];
		if (channelVisibility == UserChannelVisibility.PRIVATE) {
			const invitations =
				await this.prismaService.userChannelInvitation.findMany({
					where: { userId: user.id },
					include: { channel: { include: { participants: true } } },
				});
			channels = invitations.map((invitation) => {
				return { ...invitation.channel };
			});
			channels.push(
				...(await this.prismaService.userChannel.findMany({
					where: {
						participants: { some: { userId: user.id } },
						visibility: channelVisibility,
					},
					include: {
						participants: true,
					},
				})),
			);
		} else {
			channels = await this.prismaService.userChannel.findMany({
				where: { visibility: channelVisibility },
				include: {
					participants: true,
				},
			});
		}
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

	async createChannel(user: User, channelDTO: CreateChannelDTO) {
		let visibility: UserChannelVisibility;
		let hashedPwd = '';

		await this.prismaService.userChannel
			.findUnique({
				where: {
					name: channelDTO.channelName,
				},
			})
			.then((channel) => {
				if (channel)
					throw new BadRequestException('Channel already exist !');
			});

		if (channelDTO.channelType === EChannelType.PUBLIC)
			visibility = UserChannelVisibility.PUBLIC;
		else if (channelDTO.channelType === EChannelType.PRIVATE)
			visibility = UserChannelVisibility.PRIVATE;
		else {
			if (channelDTO.channelPassword === undefined)
				throw new BadRequestException('Password requiered');
			hashedPwd = await argon.hash(channelDTO.channelPassword);
			visibility = UserChannelVisibility.PWD_PROTECTED;
		}

		await this.prismaService.userChannel.create({
			data: {
				name: channelDTO.channelName,
				visibility: visibility,
				password: UserChannelVisibility.PWD_PROTECTED
					? hashedPwd
					: null,
				participants: {
					create: {
						userId: user.id,
						role: UserOnChannelRole.OPERATOR,
					},
				},
			},
		});
		this.sendChannelListWhereUserIs(user.id);
		return undefined;
	}

	async hasUserCreatedPlayingInvitation(userId: number) {
		return (await this.prismaService.matchInvitation.findFirst({
			where: { createdById: userId },
		}))
			? true
			: false;
	}

	async getInvitationInChannel(userId: number, channelId: number) {
		const invite = await this.prismaService.matchInvitation.findFirst({
			where: { createdById: userId },
			include: {
				message: {
					include: {
						channel: {
							include: {
								participants: true,
							},
						},
					},
				},
				createdBy: true,
			},
		});
		return invite.message.channel.id == channelId ? invite : null;
	}
}
