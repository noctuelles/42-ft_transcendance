import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserChannelVisibility, UserOnChannelRole } from '@prisma/client';
import * as argon from 'argon2';
import { UsersService } from '../users/users.service';

import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsService } from '../websockets/websockets.service';

import Channel, { IMessage } from './Channel';
import { CreateChannelDTO, EChannelType } from './Channel.dto';

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
		private readonly usersService: UsersService,
	) {}

	async sendMessage(message: IMessage, channelId: number): Promise<void> {
		const channel: Channel = await this.getChannel(channelId);
		const users = await Promise.all(
			channel.completeMembers.map(async (member) => {
				const blocked = await this.usersService.fetchBlockedList(
					member.userId,
				);
				if (blocked.find((b) => b.name === message.username)) {
					return null;
				}
				return member.userId;
			}),
		);
		this.websocketsService.sendToAllUsers(users, 'chat', message);
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
		const userChannel = await this.prismaService.userChannel.findUnique({
			where: { id: channelId },
			include: {
				participants: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								status: true,
								profile: { select: { picture: true } },
							},
						},
					},
				},
				invitations: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								profile: { select: { picture: true } },
							},
						},
					},
				},
			},
		});
		chann.convertFromUserChannel(userChannel);
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
		let channels = await this.getChannelWehreUserIs(userId);
		const blocked = await this.usersService.fetchBlockedList(userId);
		const blockedBy = await this.usersService.fetchBlockedByList(userId);
		channels = channels.filter((channel) => {
			if (channel.type === UserChannelVisibility.PRIVATE_MESSAGE) {
				let found = false;
				channel.completeMembers.forEach((member) => {
					if (
						blocked.filter((b) => b.id === member.userId).length >
							0 ||
						blockedBy.filter((b) => b.id === member.userId).length >
							0
					) {
						found = true;
					}
				});
				if (found) {
					return false;
				}
			}
			return true;
		});
		const channelsForFront = await Promise.all(
			channels.map(async (channel) => {
				let {
					muted,
					banned,
					hashedPwd,
					completeMembers,
					...frontChannel
				} = channel;
				const unreaded =
					await this.prismaService.messageOnChannel.count({
						where: {
							channelId: channel.id,
							id: {
								gt: channel.completeMembers.find(
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

	async sendChannelListToSocket(socket: any): Promise<void> {
		this.sendChannelListToAllSockets([socket]);
	}

	async sendChannelListToAllSockets(sockets: any[]): Promise<void> {
		const channels = await this.getChannelList();
		sockets.map((socket) => {
			this.websocketsService.send(
				socket,
				'channels',
				channels.map((channel) => {
					let { muted, banned, ...frontChannels } = channel;
					return frontChannels;
				}),
			);
		});
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
				participants: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								status: true,
								profile: { select: { picture: true } },
							},
						},
					},
				},
				invitations: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								profile: { select: { picture: true } },
							},
						},
					},
				},
			},
		});
		return rawChannelList.map((rawChannel) => {
			const channel = new Channel(rawChannel.id);
			channel.convertFromUserChannel(rawChannel);
			return channel;
		});
	}

	async getChannelList(): Promise<Channel[]> {
		const rawChannelList = await this.prismaService.userChannel.findMany({
			include: {
				participants: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								status: true,
								profile: { select: { picture: true } },
							},
						},
					},
				},
				invitations: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								profile: { select: { picture: true } },
							},
						},
					},
				},
			},
		});
		return rawChannelList.map((rawChannel) => {
			const channel = new Channel(rawChannel.id);
			channel.convertFromUserChannel(rawChannel);
			return channel;
		});
	}

	sendChannelListWhereUserIs(userId: number) {
		if (this.websocketsService.getSocketsFromUsersId([userId]).length > 0) {
			this.sendChannelListWhereUserIsToSocket(
				this.websocketsService.getSocketsFromUsersId([userId])[0],
				userId,
			);
		}
	}

	sendChannelListToUserIds(userIds: number[]) {
		userIds.map((userId) => {
			this.sendChannelListWhereUserIs(userId);
		});
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

	async changeChannelPwd(
		userId: number,
		channelId: number,
		password: string,
	) {
		const currentChannel = await this.prismaService.userChannel.findUnique({
			where: {
				id: channelId,
			},
			select: {
				password: true,
				participants: {
					where: {
						userId: userId,
						role: UserOnChannelRole.OPERATOR,
					},
				},
			},
		});
		if (!currentChannel) throw new BadRequestException('No such channel');
		if (currentChannel.participants.length === 0)
			throw new BadRequestException('Invalid user permission');
		if (await argon.verify(currentChannel.password, password))
			throw new BadRequestException('Password is the same as before');
		return await this.prismaService.userChannel.update({
			where: {
				id: channelId,
			},
			data: {
				password: await argon.hash(password),
			},
			select: {
				id: true,
				name: true,
			},
		});
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
		if (!invite) return null;
		return invite.message.channel.id == channelId ? invite : null;
	}

	sendChannelListToAllUsers(userIds: number[]) {
		this.sendChannelListToAllSockets(
			this.websocketsService.getSocketsFromUsersId(userIds),
		);
	}

	async getMpChannel(name1: string, name2: string): Promise<Channel | null> {
		const chan = await this.prismaService.userChannel.findFirst({
			where: {
				visibility: UserChannelVisibility.PRIVATE_MESSAGE,
				AND: [
					{
						participants: {
							some: {
								user: {
									name: name1,
								},
							},
						},
					},
					{
						participants: {
							some: {
								user: {
									name: name2,
								},
							},
						},
					},
				],
			},
		});
		if (!chan) return null;
		return await this.getChannel(chan.id);
	}

	async createMpChannel(name1: string, name2: string): Promise<Channel> {
		const chan = await this.prismaService.userChannel.create({
			data: {
				name: `${name1} - ${name2}`,
				visibility: UserChannelVisibility.PRIVATE_MESSAGE,
				participants: {
					create: [
						{
							user: {
								connect: {
									name: name1,
								},
							},
						},
						{
							user: {
								connect: {
									name: name2,
								},
							},
						},
					],
				},
			},
		});
		return await this.getChannel(chan.id);
	}

	async joinMp(user, otherName) {
		let channel = await this.getMpChannel(user.name, otherName);
		if (!channel)
			channel = await this.createMpChannel(user.name, otherName);
		channel.completeMembers.forEach((member) => {
			this.sendChannelListWhereUserIs(member.userId);
		});
	}
}
