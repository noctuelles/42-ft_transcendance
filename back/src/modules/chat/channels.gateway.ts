import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChannelsGateway {
	constructor(private readonly chatService: ChatService) {}
	@SubscribeMessage('channels')
	async handleMessage(socket: any, data: any) {
		while (!socket.user) await new Promise((r) => setTimeout(r, 50));
		this.chatService.sendChannelListWhereUserIs(socket.user.id);
	}
}
