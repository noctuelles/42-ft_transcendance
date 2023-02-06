import { Controller, Patch, Body, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/modules/auth/guards/currentUser.decorator';
import { User } from '@prisma/client';
import { ChatService } from './chat.service';
import { JoinChannelDTO } from './JoinChannel.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateChannelValidationPipe } from './validation.pipe';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	@UseGuards(AuthGuard)
	@UsePipes(ValidationPipe)
	@Patch('channel/join')
	async joinChannel(
		@CurrentUser() user: User,
		@Body()
		{ channelId, password }: JoinChannelDTO,
	) {
		if (
			this.chatService
				.getChannel(channelId)
				?.canUserJoin(user.id, password)
		) {
			this.chatService.getChannel(channelId).addUser(user.id);
			this.chatService.sendChannelListToUser(user.id);
		} else {
			// TODO: Return error to tell why not allowed
		}
	}
}
