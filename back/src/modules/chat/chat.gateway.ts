import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import { Message, ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}
	@WebSocketServer() server;
	@SubscribeMessage('chat')
	async handleMessage(socket: any, data: any) {
		data.username = socket.user.name;
		this.chatService.sendChannelListTo([3]);
		if (
			!this.chatService.isIMessage(data) ||
			!this.chatService.canSendToChannel(socket.user.id, data.channel)
		) {
			return;
		}
		let message = new Message(data);
		this.chatService.sendTo(message.channel, message);
	}
}
