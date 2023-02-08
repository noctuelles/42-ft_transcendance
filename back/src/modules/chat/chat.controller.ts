import {
	Controller,
	Patch,
	Body,
	UseGuards,
	Get,
	Param,
	BadRequestException,
} from '@nestjs/common';
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
}
