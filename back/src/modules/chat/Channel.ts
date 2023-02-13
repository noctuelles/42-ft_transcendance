import {
	MathInvitationStatus,
	Prisma,
	UserChannel,
	UserOnChannel,
	UserStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserChannelVisibility } from '@prisma/client';
import { UserOnChannelRole } from '@prisma/client';
import { UserOnChannelStatus } from '@prisma/client';
import { WebsocketsService } from '../websockets/websockets.service';
import { GameService } from '../game/game.service';
import * as argon from 'argon2';
import { UsersService } from '../users/users.service';

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

interface reducedUser {
	id: number;
	name: string;
	status: UserStatus;
	profile: { picture: string };
}

type ChannelWithUser = UserChannel & {
	participants: (UserOnChannel & {
		user: reducedUser;
	})[];
};

export default class Channel {
	id: number;
	name: string;
	type: UserChannelVisibility;
	ownerId: number;
	members: reducedUser[];
	membersId: number[];
	adminsId: number[];
	muted: IPunishment[];
	banned: IPunishment[];
	hashedPwd: string;
	completeMembers;
	constructor(id: number) {
		this.id = id;
	}

	convertFromUserChannel(userChannel: ChannelWithUser): void {
		if (!userChannel) {
			return;
		}
		this.completeMembers = userChannel.participants;
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
		this.members = userChannel.participants.map((participant) => {
			return participant.user;
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
		const lastMessage = (await prismaService.messageOnChannel.findFirst({
			where: { channelId: this.id },
			orderBy: { postedAt: 'desc' },
		})) || { id: -1 };
		await prismaService.userOnChannel.create({
			data: {
				userId: userId,
				channelId: this.id,
				lastReadedMessage: lastMessage.id,
			},
		});
		this.membersId.push(userId);
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
		this.membersId = this.membersId.filter((id) => {
			return id !== userId;
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
		prismaService.userOnChannel
			.update({
				where: { id: { userId: userId, channelId: this.id } },
				data: {
					status: UserOnChannelStatus.BANNED,
					statusEnd: unbanDate,
				},
			})
			.then(),
			this.banned.push({ userId: userId, endDate: unbanDate });
	}

	pardon(prismaService: PrismaService, userId: number): boolean {
		prismaService.userOnChannel
			.update({
				where: { id: { userId: userId, channelId: this.id } },
				data: { status: UserOnChannelStatus.CLEAN, statusEnd: null },
			})
			.then();
		return this.removeAllMatches(this.banned, (punishment) => {
			return punishment.userId === userId;
		});
	}

	mute(prismaService: PrismaService, userId: number, unmuteDate: Date): void {
		prismaService.userOnChannel
			.update({
				where: { id: { userId: userId, channelId: this.id } },
				data: {
					status: UserOnChannelStatus.MUTED,
					statusEnd: unmuteDate,
				},
			})
			.then();
		this.muted.push({ userId: userId, endDate: unmuteDate });
	}

	unmute(prismaService: PrismaService, userId: number): boolean {
		prismaService.userOnChannel
			.update({
				where: { id: { userId: userId, channelId: this.id } },
				data: { status: UserOnChannelStatus.CLEAN, statusEnd: null },
			})
			.then();
		return this.removeAllMatches(this.muted, (punishment) => {
			return punishment.userId === userId;
		});
	}

	promote(prismaService: PrismaService, userId: number): void {
		prismaService.userOnChannel
			.update({
				where: { id: { userId: userId, channelId: this.id } },
				data: {
					role: UserOnChannelRole.ADMIN,
				},
			})
			.then();
		this.adminsId.push(userId);
	}

	unpromote(prismaService: PrismaService, userId: number): void {
		prismaService.userOnChannel
			.update({
				where: { id: { userId: userId, channelId: this.id } },
				data: {
					role: UserOnChannelRole.USER,
				},
			})
			.then();
		this.adminsId.splice(this.adminsId.indexOf(userId), 1);
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

	async getMessages(
		prismaService: PrismaService,
		usersService: UsersService,
		fetcherId: number,
	) {
		const messages = await prismaService.messageOnChannel.findMany({
			where: { channelId: this.id },
			orderBy: { postedAt: 'asc' },
			include: {
				author: true,
				matchInvitation: true,
			},
		});
		const blocked = await usersService.fetchBlockedList(fetcherId);
		return messages
			.map((message) => {
				if (blocked.map((b) => b.id).includes(message.authorId)) {
					return null;
				}
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
				return m != null && (m.isInvitation || m.message !== '');
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

	async readAllMessages(userId: number, prismaService: PrismaService) {
		const lastMessage = await prismaService.messageOnChannel.findFirst({
			where: { channelId: this.id },
			orderBy: { postedAt: 'desc' },
		});
		if (lastMessage) {
			await prismaService.userOnChannel.update({
				where: { id: { userId: userId, channelId: this.id } },
				data: { lastReadedMessage: lastMessage.id },
			});
		}
	}

	canBan(actionUserId: number, bannedId: number) {
		return (
			actionUserId === this.ownerId ||
			(this.adminsId.includes(actionUserId) &&
				this.isRegularUser(bannedId))
		);
	}

	isRegularUser(userId: number) {
		return this.ownerId !== userId && !this.adminsId.includes(userId);
	}

	async delete(prismaServie: PrismaService) {
		await prismaServie.messageOnChannel.deleteMany({
			where: { channelId: this.id },
		});
		await prismaServie.userOnChannel.deleteMany({
			where: { channelId: this.id },
		});
		await prismaServie.userChannel.delete({
			where: { id: this.id },
		});
	}

	async canInvite(
		prismaService: PrismaService,
		inviterId: number,
		invitedUsername: string,
	): Promise<string | null> {
		const user = await prismaService.user.findUnique({
			where: { name: invitedUsername },
		});
		if (!user) {
			return "The user doesn't exist";
		}
		if (
			await prismaService.userChannelInvitation.findFirst({
				where: { userId: user.id, channelId: this.id },
			})
		) {
			return 'User already invited';
		}
		if (this.isUserBanned(prismaService, user.id)) {
			return 'User is banned';
		}
		if (this.ownerId !== inviterId && !this.adminsId.includes(inviterId)) {
			return 'You are not allowed to invite';
		}
		if (this.completeMembers.find((m) => m.user.name === invitedUsername)) {
			return 'User is already in the channel';
		}
		return null;
	}

	async invite(prismaService: PrismaService, invitedUsername: string) {
		const user = await prismaService.user.findUnique({
			where: { name: invitedUsername },
		});
		await prismaService.userChannelInvitation.create({
			data: {
				userId: user.id,
				channelId: this.id,
			},
		});
	}
}
