import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/modules/auth/guards/currentUser.decorator';
import { User } from '@prisma/client';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	@UseGuards(AuthGuard)
	@Patch('channel/join')
	async joinChannel(
		@CurrentUser() user: User,
		@Body()
		{
			channelId,
			password,
		}: { channelId: number; password: string | undefined },
	) {
		if (
			this.chatService.isUserAllowedToJoinChannel(
				user.id,
				channelId,
				password,
			)
		)
			this.chatService.addUserInChannel(user.id, channelId);
		else {
			// TODO: Return error to tell why not allowed
		}
	}
}
