import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { Message, ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway()
export class ChatGateway {
	constructor(
		private readonly chatService: ChatService,
		private readonly prismaService: PrismaService,
	) {}
	@SubscribeMessage('chat')
	async handleMessage(socket: any, data: any) {
		data.username = socket.user.name;
		data['isInvitation'] = false;
		if (
			!this.chatService.isIMessage(data) ||
			!(
				await this.chatService.getChannel(data.channel)
			).canUserSendMessage(
				this.prismaService,
				this.chatService,
				socket.user.id,
			)
		) {
			return;
		}
		let message = new Message(data);
		this.chatService.sendMessage(message, data.channel);
	}
}
