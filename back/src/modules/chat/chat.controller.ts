import { Controller, Patch, Body, UseGuards, Post, Get } from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/modules/auth/guards/currentUser.decorator';
import { User } from '@prisma/client';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { JoinChannelDTO } from './JoinChannel.dto';
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
			this.chatService.sendChannelListToUser(user.id);
		} else {
			// TODO: Return error to tell why not allowed
		}
	}

	@UseGuards(AuthGuard)
	@Get('channels/public')
	async getPublicChannels(@CurrentUser() user: User) {
		return await this.chatService.getPublicChannels(user);
	}

	@UseGuards(AuthGuard)
	@Get('channels/password-protected')
	async getpasswordProtectedChannels(@CurrentUser() user: User) {
		return [];
	}

	@UseGuards(AuthGuard)
	@Get('channels/invited')
	async getInvitedChannels(@CurrentUser() user: User) {
		return [];
	}
}
