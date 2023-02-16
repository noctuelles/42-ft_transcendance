import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/modules/auth/guards/currentUser.decorator';
import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { User, UserChannelVisibility } from '@prisma/client';

import { GameService } from '../game/game.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { WebsocketsService } from '../websockets/websockets.service';

import {
	ActionInChannelDTO,
	ChangeChannelPwdDTO,
	CreateChannelDTO,
	InviteDTO,
	JoinChannelDTO,
	LeaveChannelDTO,
	PromoteDTO,
} from './Channel.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly prismaService: PrismaService,
		private readonly websocketsService: WebsocketsService,
		private readonly gameService: GameService,
		private readonly usersService: UsersService,
	) {}

	@UseGuards(AuthGuard)
	@Patch('channel/join')
	async joinChannel(
		@CurrentUser() user: User,
		@Body() { channelId, password }: JoinChannelDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (
			await channel?.canUserJoin(
				this.prismaService,
				this.chatService,
				user.id,
				password,
			)
		) {
			await channel.addUser(this.prismaService, user.id);
			this.chatService.sendChannelListToUserIds(channel.membersId);
			return {
				success: true,
				channel: {
					id: channel.id,
					members: channel.membersId.length,
				},
			};
		} else {
			return {
				sucess: false,
				reason: channel?.getJoinError(
					this.prismaService,
					this.chatService,
					user.id,
				),
			};
		}
	}

	@UseGuards(AuthGuard)
	@Patch('channel/ban')
	async ban(
		@CurrentUser() user: User,
		@Body() { channelId, end, userId }: ActionInChannelDTO,
	) {
		if (end < new Date()) {
			throw new BadRequestException('End date must be in the future');
		}
		const channel = await this.chatService.getChannel(channelId);
		if (!channel) {
			throw new NotFoundException('Channel does not exist');
		}
		if (!channel.canBan(user.id, userId))
			throw new ForbiddenException("You can't do that !");
		await channel.ban(
			this.prismaService,
			this.websocketsService,
			userId,
			end,
		);
		this.chatService.sendChannelListToUserIds([
			...channel.membersId,
			userId,
		]);
	}

	@UseGuards(AuthGuard)
	@Patch('channel/mute')
	async mute(
		@CurrentUser() user: User,
		@Body() { channelId, end, userId }: ActionInChannelDTO,
	) {
		if (end < new Date()) {
			throw new BadRequestException('End date must be in the future');
		}
		const channel = await this.chatService.getChannel(channelId);
		if (!channel) {
			throw new NotFoundException('Channel does not exist');
		}
		if (!channel.canBan(user.id, userId))
			throw new ForbiddenException("You can't do that !");
		await channel.mute(
			this.prismaService,
			this.websocketsService,
			userId,
			end,
		);
		this.chatService.sendChannelListToUserIds(channel.membersId);
	}

	@UseGuards(AuthGuard)
	@Patch('channel/promote')
	async promote(
		@CurrentUser() user: User,
		@Body() { channelId, userId }: PromoteDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel) {
			throw new NotFoundException('Channel does not exist');
		}
		if (channel.ownerId !== user.id)
			throw new ForbiddenException("You can't do that !");
		await channel.promote(
			this.prismaService,
			this.websocketsService,
			userId,
		);
		this.chatService.sendChannelListToUserIds(channel.membersId);
	}

	@UseGuards(AuthGuard)
	@Patch('channel/unpromote')
	async unpromote(
		@CurrentUser() user: User,
		@Body() { channelId, userId }: PromoteDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel) {
			throw new NotFoundException('Channel does not exist');
		}
		if (channel.ownerId !== user.id)
			throw new ForbiddenException("You can't do that !");
		await channel.unpromote(
			this.prismaService,
			this.websocketsService,
			userId,
		);
		this.chatService.sendChannelListToUserIds(channel.membersId);
	}

	@UseGuards(AuthGuard)
	@Patch('channel/kick')
	async kick(
		@CurrentUser() user: User,
		@Body() { channelId, userId }: PromoteDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel) {
			throw new NotFoundException('Channel does not exist');
		}
		if (!channel.canBan(user.id, userId))
			throw new ForbiddenException("You can't do that !");
		await channel.removeUser(this.prismaService, userId);
		this.chatService.sendChannelListToUserIds([
			channel.ownerId,
			...channel.adminsId,
			userId,
		]);
		const sockets = this.websocketsService.getSocketsFromUsersId([userId]);
		if (sockets.length > 0) {
			this.websocketsService.send(sockets[0], 'chat-action', {
				action: 'kicked',
				channel: channel.name,
			});
		}
	}

	@UseGuards(AuthGuard)
	@Patch('channel/leave')
	async leaveChannel(
		@CurrentUser() user: User,
		@Body() { channelId }: LeaveChannelDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (channel?.containsUser(user.id)) {
			if (channel.type === UserChannelVisibility.PRIVATE_MESSAGE) {
				throw new ForbiddenException("You can't leave a pm channel");
			}
			if (
				channel.isUserBanned(
					this.prismaService,
					this.chatService,
					user.id,
				)
			) {
				throw new ForbiddenException(
					"You can't leave a channel wehre you are banned",
				);
			}
			let deleted = false;
			if (channel.ownerId === user.id) {
				await channel.delete(this.prismaService);
				deleted = true;
			} else {
				await channel.removeUser(this.prismaService, user.id);
				if (channel.membersId.length <= 0) {
					await channel.delete(this.prismaService);
					deleted = true;
				}
			}
			this.chatService.sendChannelListToUserIds([
				...channel.membersId,
				user.id,
			]);
			return {
				success: true,
				deleted,
				channel: {
					id: channel.id,
					members: channel.membersId.length,
				},
			};
		} else {
			throw new ForbiddenException('You are not in this channel');
		}
	}

	@UseGuards(AuthGuard)
	@Get('channels/public')
	async getPublicChannels(@CurrentUser() user: User) {
		return await this.chatService.getChannelsAvailableForUser(
			user,
			UserChannelVisibility.PUBLIC,
		);
	}

	@UseGuards(AuthGuard)
	@Get('channels/password-protected')
	async getpasswordProtectedChannels(@CurrentUser() user: User) {
		return await this.chatService.getChannelsAvailableForUser(
			user,
			UserChannelVisibility.PWD_PROTECTED,
		);
	}

	@UseGuards(AuthGuard)
	@Get('channels/invited')
	async getInvitedChannels(@CurrentUser() user: User) {
		return await this.chatService.getChannelsAvailableForUser(
			user,
			UserChannelVisibility.PRIVATE,
		);
	}

	@UseGuards(AuthGuard)
	@Get('channel/:channelId/messages')
	async getChannelMessages(
		@CurrentUser() user: User,
		@Param('channelId', ParseIntPipe) channelId: number,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (channel?.containsUser(user.id)) {
			return await channel.getMessages(
				this.prismaService,
				this.usersService,
				user.id,
			);
		} else {
			throw new ForbiddenException('You are not in this channel');
		}
	}

	@UseGuards(AuthGuard)
	@Post('channels/create')
	async createChannel(
		@CurrentUser() user: User,
		@Body() createChannelDTO: CreateChannelDTO,
	) {
		return await this.chatService.createChannel(user, createChannelDTO);
	}

	@UseGuards(AuthGuard)
	@Post('channels/mp/:otherName')
	async joinMp(
		@CurrentUser() user: User,
		@Param('otherName') otherName: string,
	) {
		if (!(await this.usersService.isUserWithName(otherName))) {
			throw new BadRequestException('User does not exist');
		}
		if (otherName === user.name) {
			throw new BadRequestException(
				'You cannot create a mp with yourself',
			);
		}
		const blocked = await this.usersService.fetchBlockedList(user.id);
		blocked.forEach((b) => {
			if (b.name === otherName) {
				throw new BadRequestException(
					'You cannot create a mp with a blocked user',
				);
			}
		});
		const blockedBy = await this.usersService.fetchBlockedByList(user.id);
		blockedBy.forEach((b) => {
			if (b.name === otherName) {
				throw new BadRequestException(
					'You cannot create a mp with a user that blocked you',
				);
			}
		});
		return await this.chatService.joinMp(user, otherName);
	}

	@UseGuards(AuthGuard)
	@Patch('channels/:channelId/chpwd')
	async changeChannelPwd(
		@CurrentUser() user: User,
		@Param('channelId', ParseIntPipe) channelId: number,
		@Body() changeChannelPwd: ChangeChannelPwdDTO,
	) {
		return this.chatService.changeChannelPwd(
			user.id,
			channelId,
			changeChannelPwd.channelPassword,
		);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/invite/play')
	async inviteToGame(
		@CurrentUser() user: User,
		@Param('channelId', ParseIntPipe) channelId: number,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel?.containsUser(user.id)) {
			throw new ForbiddenException('User is not in this channel');
		}
		if (await this.chatService.hasUserCreatedPlayingInvitation(user.id)) {
			return {
				success: false,
				reason: 'You already created a game invitation',
			};
		}
		channel.invitePlay(user, this.prismaService, this.websocketsService);
		return {
			success: true,
		};
	}

	@UseGuards(AuthGuard)
	@Delete('channel/:channelId/invite/play')
	async deleteInvitation(
		@CurrentUser() user: User,
		@Param('channelId', ParseIntPipe) channelId: number,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel?.containsUser(user.id)) {
			throw new ForbiddenException('User is not in this channel');
		}
		const invitation = await this.chatService.getInvitationInChannel(
			user.id,
			channel.id,
		);
		if (!invitation) {
			throw new BadRequestException('Invitation not found');
		}
		channel.deleteInvitation(
			invitation.id,
			invitation.messageId,
			user.name,
			this.prismaService,
			this.websocketsService,
		);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/invite/play/accept/:inviter')
	async acceptInvitation(
		@CurrentUser() user: User,
		@Param('channelId', ParseIntPipe) channelId: number,
		@Param('inviter') inviterName: string,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel?.containsUser(user.id)) {
			throw new ForbiddenException('User is not in this channel');
		}
		const inviter = await this.prismaService.user.findUnique({
			where: { name: inviterName },
		});
		const invitation = await this.chatService.getInvitationInChannel(
			inviter.id,
			channel.id,
		);
		if (!invitation) {
			throw new BadRequestException('Invitation not found');
		}
		if (!this.gameService.isInvitationAvailable(invitation.id)) {
			throw new BadRequestException('Invitation is not available');
		}
		channel.acceptInvitation(
			invitation,
			user.id,
			this.prismaService,
			this.websocketsService,
			this.gameService,
		);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/read')
	async readAllMessages(
		@CurrentUser() user: User,
		@Param('channelId', ParseIntPipe) channelId: number,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel?.containsUser(user.id)) {
			throw new ForbiddenException('User is not in this channel');
		}
		channel.readAllMessages(user.id, this.prismaService);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/invite')
	async inviteUser(
		@CurrentUser() user: User,
		@Param('channelId', ParseIntPipe) channelId: number,
		@Body() { username }: InviteDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel?.containsUser(user.id)) {
			throw new ForbiddenException('User is not in this channel');
		}
		const error = await channel.canInvite(
			this.prismaService,
			this.chatService,
			user.id,
			username,
		);
		if (error !== null) {
			throw new BadRequestException(error);
		}
		await channel.invite(
			this.prismaService,
			this.websocketsService,
			username,
			user.name,
		);
		this.chatService.sendChannelListToUserIds(channel.membersId);
	}

	@UseGuards(AuthGuard)
	@Delete('channel/:channelId/invitation/:username')
	async deleteChatInvitation(
		@CurrentUser() user: User,
		@Param('channelId', ParseIntPipe) channelId: number,
		@Param('username') username: string,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (!channel?.containsUser(user.id)) {
			throw new ForbiddenException('User is not in this channel');
		}
		const error = channel.canDeleteInvite(user.id, username);
		if (error !== null) {
			throw new BadRequestException(error);
		}
		await channel.deleteChatInvitation(this.prismaService, username);
		this.chatService.sendChannelListToUserIds(channel.membersId);
	}
}
