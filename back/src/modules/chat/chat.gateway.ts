import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { Message, ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}
	@SubscribeMessage('chat')
	async handleMessage(socket: any, data: any) {
		data.username = socket.user.name;
		if (
			!this.chatService.isIMessage(data) ||
			!this.chatService
				.getChannel(data.channel)
				?.canUserSendMessage(socket.user.id)
		) {
			// TODO: Tell why can't send message
			return;
		}
		let message = new Message(data);
		this.chatService.sendMessage(message, data.channel);
	}
}
