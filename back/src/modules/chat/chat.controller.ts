import {
	Controller,
	Patch,
	Body,
	UseGuards,
	Get,
	Param,
	BadRequestException,
	Post,
} from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/modules/auth/guards/currentUser.decorator';
import { User, UserChannelVisibility } from '@prisma/client';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import {
	CreateChannelDTO,
	JoinChannelDTO,
	LeaveChannelDTO,
} from './Channel.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';

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
}
