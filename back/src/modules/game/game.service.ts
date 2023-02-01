import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsService } from '../websockets/websockets.service';
import { Game } from './Game.class';
import { GameType } from './Game.interfaces';

@Injectable()
export class GameService {
	private _rankedQueue = [];
	private _funQueue = [];
	games = [];

	constructor(
		private readonly websocketsService: WebsocketsService,
		private readonly prismaService: PrismaService,
	) {}

	private _treatQueue(queue, type: GameType) {
		if (queue.length >= 2) {
			const player1 = queue.shift();
			const player2 = queue.shift();
			const msg = {
				action: 'match',
				player1: {
					name: player1.user.name,
					profile_picture: player1.user.profile.picture,
				},
				player2: {
					name: player2.user.name,
					profile_picture: player2.user.profile.picture,
				},
			};
			this.websocketsService.send(player1, 'matchmaking', msg);
			this.websocketsService.send(player2, 'matchmaking', msg);
			const game = new Game(
				{ socket: player1, user: player1.user },
				{ socket: player2, user: player2.user },
				this.websocketsService,
				this.prismaService,
				type,
			);
			this.games.push(game);
			game.start(() => {
				this.games.splice(this.games.indexOf(game), 1);
			});
		}
	}

	async joinQueue(socket, type) {
		type = type.toUpperCase();
		const user = await this.prismaService.user.findUnique({
			where: { id: socket.user.id },
			include: { profile: true },
		});
		socket.user.profile = user.profile;
		this.registerQuit(socket);
		if (type === GameType.RANKED) {
			this._rankedQueue.push(socket);
			this._treatQueue(this._rankedQueue, type);
		} else if (type === GameType.FUN) {
			this._funQueue.push(socket);
			this._treatQueue(this._funQueue, type);
		}
	}

	registerQuit(socket) {
		this.websocketsService.registerOnClose(socket, () => {
			this.cancelQueue(socket);
			this.leaveGame(socket);
		});
	}

	cancelQueue(socket) {
		if (this._rankedQueue.includes(socket)) {
			this._rankedQueue.splice(this._rankedQueue.indexOf(socket), 1);
		}
		if (this._funQueue.includes(socket)) {
			this._funQueue.splice(this._funQueue.indexOf(socket), 1);
		}
	}

	getGameWherePlayerIs(userId: number) {
		return this.games.find((game: Game) => game.getPlayer(userId) != null);
	}

	leaveGame(socket) {
		const game = this.getGameWherePlayerIs(socket.user.id);
		if (!game) return;
		game.leave(socket.user.id);
	}
}
