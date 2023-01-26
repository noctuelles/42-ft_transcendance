import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsService } from '../websockets/websockets.service';
import { Game } from './Game.class';

@Injectable()
export class GameService {
	queue = [];
	games = [];

	constructor(
		private readonly websocketsService: WebsocketsService,
		private readonly prismaService: PrismaService,
	) {}

	async joinQueue(socket) {
		const user = await this.prismaService.user.findUnique({
			where: { id: socket.user.id },
			include: { profile: true },
		});
		socket.user.profile = user.profile;
		this.queue.push(socket);
		this.registerQuit(socket);
		if (this.queue.length >= 2) {
			const player1 = this.queue.shift();
			const player2 = this.queue.shift();
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
			);
			this.games.push(game);
			game.start(() => {
				this.games.splice(this.games.indexOf(game), 1);
			});
		}
	}

	registerQuit(socket) {
		this.websocketsService.registerOnClose(socket, () => {
			this.cancelQueue(socket);
			this.leaveGame(socket);
		});
	}

	cancelQueue(socket) {
		if (this.queue.includes(socket)) {
			this.queue.splice(this.queue.indexOf(socket), 1);
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
