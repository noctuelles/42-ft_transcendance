import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
	constructor(private readonly gameService: GameService) {}

	@SubscribeMessage('matchmaking')
	async matchmaking(socket: any, payload: any) {
		if (!payload || !payload.action) return;
		switch (payload.action) {
			case 'join':
				this.gameService.joinQueue(socket);
				break;
			case 'cancel':
				this.gameService.cancelQueue(socket);
				break;
		}
	}

	@SubscribeMessage('game-input')
	async gameInput(socket: any, payload: any) {
		if (!payload || !payload.action || !payload.direction) return;
		const game = this.gameService.getGameWherePlayerIs(socket.user.id);
		if (!game) return;
		game.processInput(socket.user.id, payload);
	}
}
