import { Injectable } from '@nestjs/common';
import { WebsocketsService } from '../websockets/websockets.service';

@Injectable()
export class GameService {
	queue = [];

	constructor(private readonly websocketsService: WebsocketsService) {}

	joinQueue(socket) {
		this.queue.push(socket);
		if (this.queue.length >= 2) {
			const player1 = this.queue.shift();
			const player2 = this.queue.shift();
			const msg = {
				action: 'match',
				player1: {
					name: player1.user.name,
					profile_picture: player1.user.profile_picture,
				},
				player2: {
					name: player2.user.name,
					profile_picture: player2.user.profile_picture,
				},
			};
			this.websocketsService.send(player1, 'matchmaking', msg);
			this.websocketsService.send(player2, 'matchmaking', msg);
		}
	}

	cancelQueue(socket) {
		if (this.queue.includes(socket.user)) {
			this.queue.splice(this.queue.indexOf(socket), 1);
		}
	}
}
