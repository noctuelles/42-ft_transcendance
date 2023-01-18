import { User } from '@prisma/client';
import { WebsocketsService } from '../websockets/websockets.service';

interface IPlayer {
	socket: any;
	user: User;
}

enum GameStatus {
	STARTING = 'starting',
	PLAYING = 'playing',
	ENDED = 'ended',
}

interface IGameInfos {
	width: number;
	height: number;
	paddleHeight: number;
	paddleWidth: number;
	ballRadius: number;
}

interface IPosition {
	x: number;
	y: number;
}

interface IPlayerInfos {
	infos: IPlayer;
	paddle: IPosition;
	event: 'up' | 'down' | null;
}

interface IGameState {
	gameInfos: IGameInfos;
	player1: IPlayerInfos;
	player2: IPlayerInfos;
	ball: IPosition;
}

interface IKeyEvent {
	action: 'release' | 'press';
	direction: 'up' | 'down';
}

export class Game {
	private websocketsService: WebsocketsService;

	private _player1: IPlayer;
	private _player2: IPlayer;
	private _status: GameStatus = GameStatus.STARTING;

	private _startCounter: number = 10;

	private _gameState: IGameState;

	constructor(
		player1: IPlayer,
		player2: IPlayer,
		websocketsService: WebsocketsService,
	) {
		this._player1 = player1;
		this._player2 = player2;
		this.websocketsService = websocketsService;
		this._gameState = {
			gameInfos: {
				width: 1600,
				height: 900,
				paddleHeight: 120,
				paddleWidth: 10,
				ballRadius: 15,
			},
			player1: {
				infos: this._player1,
				paddle: {
					x: 10,
					y: 390,
				},
				event: null,
			},
			player2: {
				infos: this._player2,
				paddle: {
					x: 1580,
					y: 390,
				},
				event: null,
			},
			ball: {
				x: 800,
				y: 450,
			},
		};
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

	sendStateToPlayers() {
		const res = {
			gameInfos: {
				originalWidth: this._gameState.gameInfos.width,
				originalHeight: this._gameState.gameInfos.height,
				paddleWidth: this._gameState.gameInfos.paddleWidth,
				paddleHeight: this._gameState.gameInfos.paddleHeight,
				ballRadius: this._gameState.gameInfos.ballRadius,
			},
			player1: {
				paddle: {
					x: this._gameState.player1.paddle.x,
					y: this._gameState.player1.paddle.y,
				},
				current: false,
			},
			player2: {
				paddle: {
					x: this._gameState.player2.paddle.x,
					y: this._gameState.player2.paddle.y,
				},
				current: false,
			},
			ball: {
				x: this._gameState.ball.x,
				y: this._gameState.ball.y,
			},
		};
		res.player1.current = true;
		this.websocketsService.send(this._player1.socket, 'game-state', res);
		res.player1.current = false;
		res.player2.current = true;
		this.websocketsService.send(this._player2.socket, 'game-state', res);
	}

	async start() {
		while (this._startCounter > 0) {
			//TODO: Change to 1000 ms
			await this.wait(100);
			this._startCounter--;
			this.sendToPlayers('match-starting', { time: this._startCounter });
		}
		this.sendToPlayers('match-starting', { time: this._startCounter });
		this._status = GameStatus.PLAYING;
		this.game();
	}

	updatePlayer(player: IPlayerInfos) {
		if (player.event == null) return;
		if (player.event === 'up') {
			player.paddle.y -= 10;
			if (player.paddle.y < 2) player.paddle.y = 2;
		}
		if (player.event === 'down') {
			player.paddle.y += 10;
			if (
				player.paddle.y >
				this._gameState.gameInfos.height -
					this._gameState.gameInfos.paddleHeight -
					2
			)
				player.paddle.y =
					this._gameState.gameInfos.height -
					this._gameState.gameInfos.paddleHeight -
					2;
		}
	}

	updateState() {
		this.updatePlayer(this._gameState.player1);
		this.updatePlayer(this._gameState.player2);
	}

	async game() {
		while (1) {
			await this.wait(20);
			this.updateState();
			this.sendStateToPlayers();
		}
	}

	player(userId: number): IPlayer | null {
		if (!this._player1 || !this._player2) return null;
		if (this._player1.user.id === userId) {
			return this._player1;
		} else if (this._player2.user.id === userId) {
			return this._player2;
		} else {
			return null;
		}
	}

	processInput(userId: number, data: IKeyEvent) {
		const player = this.player(userId);
		if (!player) return;
		if (data.action === 'press') {
			if (player.user.id === this._player1.user.id) {
				this._gameState.player1.event = data.direction;
			}
			if (player.user.id === this._player2.user.id) {
				this._gameState.player2.event = data.direction;
			}
		}
		if (data.action === 'release') {
			if (player.user.id === this._player1.user.id) {
				this._gameState.player1.event = null;
			}
			if (player.user.id === this._player2.user.id) {
				this._gameState.player2.event = null;
			}
		}
	}
}
