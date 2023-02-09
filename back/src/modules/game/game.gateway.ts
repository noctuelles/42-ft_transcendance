import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WebsocketsService } from '../websockets/websockets.service';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
	constructor(
		private readonly gameService: GameService,
		private readonly websocketsService: WebsocketsService,
	) {}

	@SubscribeMessage('matchmaking')
	async matchmaking(socket: any, payload: any) {
		if (!payload || !payload.action) return;
		switch (payload.action) {
			case 'join':
				this.gameService.joinQueue(socket, payload.type);
				break;
			case 'cancel':
				this.gameService.cancelQueue(socket);
				break;
			case 'leave':
				this.gameService.leaveGame(socket);
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

	@SubscribeMessage('spectate-match')
	async spectateMatch(socket: any, payload: any) {
		if (!payload || !payload.id) return;
		const game = this.gameService.getGameWherePlayerIs(payload.id);
		if (!game) {
			this.websocketsService.send(socket, 'spectate-match', {
				status: 'error',
				error: 'Game not found',
			});
			return;
		}
		this.websocketsService.send(socket, 'spectate-match', {
			status: 'success',
		});
		game.addSpectator(socket);
	}

	@SubscribeMessage('spectate-match-name')
	async spectateMatchName(socket: any, payload: any) {
		if (!payload || !payload.name) return;
		const game = this.gameService.getGameWherePlayerIsByName(payload.name);
		if (!game) {
			this.websocketsService.send(socket, 'spectate-match', {
				status: 'error',
				error: 'Game not found',
			});
			return;
		}
		this.websocketsService.send(socket, 'spectate-match', {
			status: 'success',
		});
		game.addSpectator(socket);
	}

	@SubscribeMessage('spectate-leave')
	async spectateLeave(socket: any, payload: any) {
		const game = this.gameService.getGameWhereSpectatorIs(socket.user.id);
		if (!game) return;
		game.removeSpectator(socket);
	}
}
