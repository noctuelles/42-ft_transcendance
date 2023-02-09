import { MatchInvitation, MathInvitationStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserChannelVisibility } from '@prisma/client';
import { UserOnChannelRole } from '@prisma/client';
import { UserOnChannelStatus } from '@prisma/client';
import { WebsocketsService } from '../websockets/websockets.service';
import { GameService } from '../game/game.service';
import * as argon from 'argon2';

export enum ChannelType {
	PUBLIC,
	PROTECTED,
	PRIVATE,
}

export interface IPunishment {
	userId: number;
	endDate: Date;
}

export interface IMessage {
	channel: number;
	username: string;
	message: string;
	isInvitation: boolean;
	invitationStatus?: MathInvitationStatus;
}

type ChannelWithUser = Prisma.UserChannelGetPayload<{
	include: Prisma.UserChannelInclude;
}>;

export default class Channel {
	id: number;
	name: string;
	type: UserChannelVisibility;
	ownerId: number;
	membersId: number[];
	adminsId: number[];
	muted: IPunishment[];
	banned: IPunishment[];
	hashedPwd: string;
	constructor(id: number) {
		this.id = id;
	}

	convertFromUserChannel(userChannel: ChannelWithUser): void {
		if (!userChannel) {
			return;
		}
		this.id = userChannel.id;
		this.name = userChannel.name;
		this.hashedPwd = userChannel.password;
		this.type = userChannel.visibility;
		this.ownerId = userChannel.participants.filter((user) => {
			return user.role === UserOnChannelRole.OPERATOR;
		})[0]?.userId;
		this.membersId = userChannel.participants.map((user) => {
			return user.userId;
		});
		this.adminsId = userChannel.participants
			.filter((user) => {
				return user.role === UserOnChannelRole.ADMIN;
			})
			.map((user) => {
				return user.userId;
			});
		this.muted = userChannel.participants
			.filter((user) => {
				return user.status === UserOnChannelStatus.MUTED;
			})
			.map((user) => {
				return { userId: user.userId, endDate: user.statusEnd };
			});
		this.banned = userChannel.participants
			.filter((user) => {
				return user.status === UserOnChannelStatus.BANNED;
			})
			.map((user) => {
				return { userId: user.userId, endDate: user.statusEnd };
			});
	}

	canUserSendMessage(prismaService: PrismaService, userId: number): boolean {
		return (
			this.containsUser(userId) &&
			!this.isUserMuted(prismaService, userId) &&
			!this.isUserBanned(prismaService, userId)
		);
	}

	containsUser(userId: number): boolean {
		if (!this.membersId) return false;
		return this.membersId.includes(userId);
	}

	async addUser(
		prismaService: PrismaService,
		userId: number,
	): Promise<boolean> {
		if (this.containsUser(userId)) {
			return false;
		}
		await prismaService.userOnChannel.create({
			data: { userId: userId, channelId: this.id },
		});
		return true;
	}

	async removeUser(
		prismaService: PrismaService,
		userId: number,
	): Promise<boolean> {
		if (!this.containsUser(userId)) {
			return false;
		}
		await prismaService.userChannel.update({
			where: { id: this.id },
			data: {
				participants: {
					delete: { id: { userId: userId, channelId: this.id } },
				},
			},
		});
		return true;
	}

	async canUserJoin(
		prismaService: PrismaService,
		userId: number,
		password: string,
	): Promise<boolean> {
		if (this.type === UserChannelVisibility.PRIVATE) {
			const invitation =
				await prismaService.userChannelInvitation.findUnique({
					where: { id: { userId: userId, channelId: this.id } },
				});
			if (!invitation) {
				return false;
			}
			await prismaService.userChannelInvitation.delete({
				where: { id: { userId: userId, channelId: this.id } },
			});
			return true;
		}
		if (this.isUserBanned(prismaService, userId)) {
			return false;
		}
		if (
			this.type === UserChannelVisibility.PWD_PROTECTED &&
			!(await argon.verify(this.hashedPwd, password))
		) {
			return false;
		}
		return true;
	}

	getJoinError(prismaService: PrismaService, userId: number) {
		if (this.type === UserChannelVisibility.PRIVATE) {
			return 'This channel is private';
		}
		if (this.isUserBanned(prismaService, userId)) {
			return 'You are banned from this channel';
		}
		if (this.type === UserChannelVisibility.PWD_PROTECTED) {
			return 'Wrong password';
		}
	}

	isUserBanned(prismaService: PrismaService, userId: number): boolean {
		this.purgeEndedPunishment(prismaService, this.banned);
		return this.banned.some((bannedInfos) => {
			return bannedInfos.userId === userId;
		});
	}

	isUserMuted(prismaService: PrismaService, userId: number) {
		this.purgeEndedPunishment(prismaService, this.muted);
		return this.muted.some((mutedInfos) => {
			return mutedInfos.userId === userId;
		});
	}

	async purgeEndedPunishment(
		prismaService: PrismaService,
		punishments: IPunishment[],
	) {
		await prismaService.userOnChannel.updateMany({
			where: { statusEnd: { lte: new Date() } },
			data: { status: UserOnChannelStatus.CLEAN, statusEnd: null },
		});
		this.removeAllMatches(punishments, (punishment) => {
			return punishment.endDate < new Date(Date.now());
		});
	}

	ban(prismaService: PrismaService, userId: number, unbanDate: Date): void {
		prismaService.userOnChannel.update({
			where: { id: { userId: userId, channelId: this.id } },
			data: { status: UserOnChannelStatus.BANNED, statusEnd: unbanDate },
		});
		this.banned.push({ userId: userId, endDate: unbanDate });
	}

	pardon(prismaService: PrismaService, userId: number): boolean {
		prismaService.userOnChannel.update({
			where: { id: { userId: userId, channelId: this.id } },
			data: { status: UserOnChannelStatus.CLEAN, statusEnd: null },
		});
		return this.removeAllMatches(this.banned, (punishment) => {
			return punishment.userId === userId;
		});
	}

	mute(prismaService: PrismaService, userId: number, unmuteDate: Date): void {
		prismaService.userOnChannel.update({
			where: { id: { userId: userId, channelId: this.id } },
			data: { status: UserOnChannelStatus.MUTED, statusEnd: unmuteDate },
		});
		this.muted.push({ userId: userId, endDate: unmuteDate });
	}

	unmute(prismaService: PrismaService, userId: number): boolean {
		prismaService.userOnChannel.update({
			where: { id: { userId: userId, channelId: this.id } },
			data: { status: UserOnChannelStatus.CLEAN, statusEnd: null },
		});
		return this.removeAllMatches(this.muted, (punishment) => {
			return punishment.userId === userId;
		});
	}

	removeAllMatches(array: any[], condition: (elem: any) => boolean): boolean {
		let didMatch = false;
		for (let i = array.length - 1; i >= 0; i--) {
			if (condition(array[i])) {
				didMatch = true;
				array.splice(i, 1);
			}
		}
		return didMatch;
	}

	async getMessages(prismaService: PrismaService) {
		const messages = await prismaService.messageOnChannel.findMany({
			where: { channelId: this.id },
			orderBy: { postedAt: 'asc' },
			include: {
				author: true,
				matchInvitation: true,
			},
		});
		return messages
			.map((message) => {
				let res = {
					username: message.author.name,
					channel: message.channelId,
					message: message.content,
					isInvitation: message.matchInvitation ? true : false,
				};
				if (res.isInvitation) {
					res['invitationStatus'] = message.matchInvitation.status;
				}
				return res;
			})
			.filter((m) => {
				return m.isInvitation || m.message !== '';
			});
	}

	async invitePlay(
		user,
		prismaService: PrismaService,
		websocketsService: WebsocketsService,
	) {
		websocketsService.sendToAllUsers(this.membersId, 'chat', {
			username: user.name,
			channel: this.id,
			message: '',
			isInvitation: true,
			invitationStatus: MathInvitationStatus.PENDING,
		});
		const msg = await prismaService.messageOnChannel.create({
			data: {
				authorId: user.id,
				channelId: this.id,
				content: '',
				matchInvitation: {
					create: {
						createdById: user.id,
					},
				},
			},
			include: {
				matchInvitation: true,
			},
		});
		websocketsService.registerOnClose(
			websocketsService.getSocketsFromUsersId([user.id])[0],
			() => {
				this.deleteInvitation(
					msg.matchInvitation.id,
					msg.id,
					user.name,
					prismaService,
					websocketsService,
				);
			},
		);
	}

	async deleteInvitation(
		id: number,
		messageId: number,
		username: string,
		prismaService: PrismaService,
		websocketsService: WebsocketsService,
	) {
		websocketsService.sendToAllUsers(this.membersId, 'chat-delete', {
			type: 'invitation',
			createdBy: username,
			channel: this.id,
		});
		await prismaService.matchInvitation.deleteMany({
			where: { id: id },
		});
		await prismaService.messageOnChannel.deleteMany({
			where: { id: messageId },
		});
	}

	async acceptInvitation(
		invitation,
		userId: number,
		prismaService: PrismaService,
		websocketsService: WebsocketsService,
		gameService: GameService,
	) {
		websocketsService.sendToAllUsers(this.membersId, 'chat-edit', {
			type: 'invitation',
			createdBy: invitation.createdBy.name,
			channel: this.id,
			result: MathInvitationStatus.ACCEPTED,
		});
		gameService.createFriendGame(
			websocketsService.getSocketsFromUsersId([
				userId,
				invitation.createdById,
			]),
			invitation,
		);
		await prismaService.matchInvitation.update({
			where: { id: invitation.id },
			data: { status: MathInvitationStatus.ACCEPTED },
		});
	}
}
