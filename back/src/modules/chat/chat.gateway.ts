import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

import { Message, ChatService } from '../chat/chat.service';

@WebSocketGateway()
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}
	@WebSocketServer() server;
	@SubscribeMessage('chat')
	async handleMessage(socket: any, data: any) {
		data.user = socket.user.name;
		if (!this.chatService.isIMessage(data)) {
			return;
		}
		let message = new Message(data);
		this.chatService.broadcastMessage(message);
	}
}
