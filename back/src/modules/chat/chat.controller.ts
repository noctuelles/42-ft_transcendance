import { Controller, Patch, Body, UseGuards, Post, Get } from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/modules/auth/guards/currentUser.decorator';
import { User, UserChannelVisibility } from '@prisma/client';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { JoinChannelDTO, LeaveChannelDTO } from './Channel.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateChannelValidationPipe } from './validation.pipe';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly prismaService: PrismaService,
	) {}

	@UseGuards(AuthGuard)
	@UsePipes(ValidationPipe)
	@Patch('channel/join')
	async joinChannel(
		@CurrentUser() user: User,
		@Body()
		{ channelId, password }: JoinChannelDTO,
	) {
		const channel = await this.chatService.getChannel(channelId);
		if (channel?.canUserJoin(this.prismaService, user.id, password)) {
			await channel.addUser(this.prismaService, user.id);
			this.chatService.sendChannelListWhereUserIs(user.id);
			return { success: true };
		} else {
			return {
				sucess: false,
				reason: channel?.getJoinError(
					this.prismaService,
					user.id,
					password,
				),
			};
		}
	}

	@UseGuards(AuthGuard)
	@UsePipes(ValidationPipe)
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
		return [];
	}
}
