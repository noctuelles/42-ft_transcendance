import {
	Controller,
	Patch,
	Body,
	UseGuards,
	Get,
	Param,
	BadRequestException,
	Post,
	ForbiddenException,
	Delete,
	ParseIntPipe,
	HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/modules/auth/guards/currentUser.decorator';
import { User, UserChannelVisibility } from '@prisma/client';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import {
	ChangeChannelPwdDTO,
	CreateChannelDTO,
	JoinChannelDTO,
	LeaveChannelDTO,
} from './Channel.dto';
import { WebsocketsService } from '../websockets/websockets.service';
import { GameService } from '../game/game.service';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly prismaService: PrismaService,
		private readonly websocketsService: WebsocketsService,
		private readonly gameService: GameService,
	) {}

	@UseGuards(AuthGuard)
	@Patch('channel/join')
	async joinChannel(
		@CurrentUser() user: User,
		@Body()
		{ channelId, password }: JoinChannelDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (await channel?.canUserJoin(this.prismaService, user.id, password)) {
			await channel.addUser(this.prismaService, user.id);
			this.chatService.sendChannelListWhereUserIs(user.id);
			return { success: true };
		} else {
			return {
				sucess: false,
				reason: channel?.getJoinError(this.prismaService, user.id),
			};
		}
	}

	@UseGuards(AuthGuard)
	@Patch('channel/leave')
	async leaveChannel(
		@CurrentUser() user: User,
		@Body()
		{ channelId }: LeaveChannelDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (channel?.containsUser(user.id)) {
			await channel.removeUser(this.prismaService, user.id);
			this.chatService.sendChannelListWhereUserIs(user.id);
			return { success: true };
		} else {
			// TODO: Return error to tell why not allowed
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
		@Param('channelId') channelId: string,
	) {
		if (isNaN(parseInt(channelId))) {
			throw new BadRequestException('Channel ID must be a number');
		}
		const channel = await this.chatService.getChannel(parseInt(channelId));
		if (channel?.containsUser(user.id)) {
			return await channel.getMessages(this.prismaService);
		} else {
			// TODO: Return error to tell why not allowed
		}
	}

	@UseGuards(AuthGuard)
	@Post('channels/create')
	async createChannel(
		@CurrentUser() user: User,
		@Body()
		createChannelDTO: CreateChannelDTO,
	) {
		return await this.chatService.createChannel(user, createChannelDTO);
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
		@Param('channelId') channelId: string,
	) {
		if (isNaN(parseInt(channelId))) {
			throw new BadRequestException('Channel ID must be a number');
		}
		const channel = await this.chatService.getChannel(parseInt(channelId));
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
		@Param('channelId') channelId: string,
		@Param('inviter') inviterName: string,
	) {
		if (isNaN(parseInt(channelId))) {
			throw new BadRequestException('Channel ID must be a number');
		}
		const channel = await this.chatService.getChannel(parseInt(channelId));
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
		channel.acceptInvitation(
			invitation,
			user.id,
			this.prismaService,
			this.websocketsService,
			this.gameService,
		);
	}
}
