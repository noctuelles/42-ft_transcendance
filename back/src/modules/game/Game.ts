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

interface IBall {
	position: IPosition;
	direction: IPosition;
	velocity: number;
}

interface IGameState {
	gameInfos: IGameInfos;
	player1: IPlayerInfos;
	player2: IPlayerInfos;
	ball: IBall;
}

interface IKeyEvent {
	action: 'release' | 'press';
	direction: 'up' | 'down';
}

interface IRect {
	x: number;
	y: number;
	width: number;
	height: number;
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
					x: 50,
					y: 390,
				},
				event: null,
			},
			player2: {
				infos: this._player2,
				paddle: {
					x: 1540,
					y: 390,
				},
				event: null,
			},
			ball: {
				position: {
					x: 800,
					y: 450,
				},
				direction: {
					x: Math.random() * (Math.random() < 0.5 ? -1 : 1),
					y: Math.random() / 3,
				},
				velocity: 10,
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
				x: this._gameState.ball.position.x,
				y: this._gameState.ball.position.y,
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

	checkBallCollideWall(ball: IBall, ballRadius: number) {
		if (ball.position.x < ballRadius) {
			ball.position.x = this._gameState.gameInfos.width / 2;
			ball.position.y = this._gameState.gameInfos.height / 2;
			ball.direction.x = Math.random();
			ball.direction.y = Math.random() * 0.5;
			ball.velocity = 10;
		}
		if (ball.position.x > this._gameState.gameInfos.width - ballRadius) {
			ball.direction.x = 0;
			ball.direction.y = 0;
			ball.position.x = this._gameState.gameInfos.width / 2;
			ball.position.y = this._gameState.gameInfos.height / 2;
			ball.direction.x = Math.random();
			ball.direction.y = Math.random() * 0.5;
			ball.velocity = 10;
		}
		if (ball.position.y < ballRadius) {
			ball.position.y = ballRadius;
			ball.direction.y *= -1;
		}
		if (ball.position.y > this._gameState.gameInfos.height - ballRadius) {
			ball.position.y = this._gameState.gameInfos.height - ballRadius;
			ball.direction.y *= -1;
		}
	}

	checkColide(collide1: IRect, collide2: IRect) {
		return (
			collide1.x < collide2.x + collide2.width &&
			collide1.x + collide1.width > collide2.x &&
			collide1.y < collide2.y + collide2.height &&
			collide1.y + collide1.height > collide2.y
		);
	}

	checkBallCollidePaddle(
		ball: IBall,
		ballRadius: number,
		paddle: IPosition,
		paddleWidth: number,
		paddleHeight: number,
	) {
		const ballColide: IRect = {
			x: ball.position.x - ballRadius,
			y: ball.position.y - ballRadius,
			width: ballRadius * 2,
			height: ballRadius * 2,
		};
		const paddleColide: IRect = {
			x: paddle.x,
			y: paddle.y,
			width: paddleWidth,
			height: paddleHeight,
		};
		if (this.checkColide(ballColide, paddleColide)) {
			ball.direction.x *= -1;
			ball.velocity += 1;
		}
	}

	normalizeDirection(ball: IBall) {
		const norm = Math.sqrt(
			ball.direction.x * ball.direction.x +
				ball.direction.y * ball.direction.y,
		);
		if (norm === 0) return;
		ball.direction.x /= norm;
		ball.direction.y /= norm;
	}

	updateBall(ball: IBall) {
		this.normalizeDirection(ball);
		const ballRadius: number = this._gameState.gameInfos.ballRadius;
		ball.position.x += ball.direction.x * ball.velocity;
		ball.position.y += ball.direction.y * ball.velocity;
		this.checkBallCollideWall(ball, ballRadius);
		this.checkBallCollidePaddle(
			ball,
			ballRadius,
			this._gameState.player1.paddle,
			this._gameState.gameInfos.paddleWidth,
			this._gameState.gameInfos.paddleHeight,
		);
		this.checkBallCollidePaddle(
			ball,
			ballRadius,
			this._gameState.player2.paddle,
			this._gameState.gameInfos.paddleWidth,
			this._gameState.gameInfos.paddleHeight,
		);
	}

	updateState() {
		this.updatePlayer(this._gameState.player1);
		this.updatePlayer(this._gameState.player2);
		this.updateBall(this._gameState.ball);
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
