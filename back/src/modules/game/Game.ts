import { User } from '@prisma/client';
import { WebsocketsService } from '../websockets/websockets.service';

interface Player {
	socket: any;
	user: User;
}

enum GameStatus {
	STARTING = 'starting',
	PLAYING = 'playing',
	ENDED = 'ended',
}

export class Game {
	private websocketsService: WebsocketsService;

	private _player1: Player;
	private _player2: Player;
	private _status: GameStatus = GameStatus.STARTING;

	private _startCounter: number = 10;

	constructor(
		player1: Player,
		player2: Player,
		websocketsService: WebsocketsService,
	) {
		this._player1 = player1;
		this._player2 = player2;
		this.websocketsService = websocketsService;
		this.start();
	}

	async wait(ms: number) {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}

	sendToPlayers(event: string, data: any) {
		this.websocketsService.send(this._player1.socket, event, data);
		this.websocketsService.send(this._player2.socket, event, data);
	}

	async start() {
		while (this._startCounter > 0) {
			await this.wait(1000);
			this._startCounter--;
			this.sendToPlayers('match-starting', { time: this._startCounter });
		}
		this.sendToPlayers('match-starting', { time: this._startCounter });
		this._status = GameStatus.PLAYING;
		this.game();
	}

	game() {}
}
