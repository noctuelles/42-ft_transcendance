import { WebsocketsService } from '../websockets/websockets.service';
import {
	convertStateToSendable,
	GameParams,
	GameStatus,
	getDefaultGameState,
	IBall,
	IGameState,
	IKeyEvent,
	IPlayer,
	IPlayerInfos,
	IPosition,
	IRect,
} from './Game.interfaces';

export class Game {
	private websocketsService: WebsocketsService;

	private _player1: IPlayer;
	private _player2: IPlayer;
	private _status: GameStatus = GameStatus.STARTING;

	private _startCounter: number = 10;
	private _gameStartTime: Date | null = null;

	private _gameState: IGameState;

	constructor(
		player1: IPlayer,
		player2: IPlayer,
		websocketsService: WebsocketsService,
	) {
		this._player1 = player1;
		this._player2 = player2;
		this.websocketsService = websocketsService;
		this._gameState = getDefaultGameState(player1, player2);
	}

	async start() {
		while (this._startCounter > 0) {
			//TODO: Change to 1000 ms
			await this._wait(100);
			this._startCounter--;
			this._sendToPlayers('match-starting', { time: this._startCounter });
		}
		this._sendToPlayers('match-starting', { time: this._startCounter });
		this._status = GameStatus.PLAYING;
		this._gameStartTime = new Date();
		this._game();
	}

	getPlayer(userId: number): IPlayer | null {
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
		const player = this.getPlayer(userId);
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

	private async _wait(ms: number) {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}

	private _sendToPlayers(event: string, data: any) {
		this.websocketsService.send(this._player1.socket, event, data);
		this.websocketsService.send(this._player2.socket, event, data);
	}

	private _sendStateToPlayers() {
		const res = convertStateToSendable(
			this._gameState,
			this._gameStartTime,
		);
		res.player1.current = true;
		this.websocketsService.send(this._player1.socket, 'game-state', res);
		res.player1.current = false;
		res.player2.current = true;
		this.websocketsService.send(this._player2.socket, 'game-state', res);
	}

	private _updatePlayer(player: IPlayerInfos) {
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

	private _resetBall(ball: IBall) {
		ball.position.x = this._gameState.gameInfos.width / 2;
		ball.position.y = this._gameState.gameInfos.height / 2;
		ball.direction.x = Math.random() * (Math.random() < 0.5 ? -1 : 1);
		ball.direction.y = (Math.random() / 3) * (Math.random() < 0.5 ? -1 : 1);
		ball.velocity = GameParams.BALL_DEFAULT_SPEED;
	}

	private _checkBallCollideWall(ball: IBall, ballRadius: number) {
		if (ball.position.x < ballRadius) {
			this._resetBall(ball);
		}
		if (ball.position.x > this._gameState.gameInfos.width - ballRadius) {
			this._resetBall(ball);
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

	private _checkColide(collide1: IRect, collide2: IRect) {
		return (
			collide1.x < collide2.x + collide2.width &&
			collide1.x + collide1.width > collide2.x &&
			collide1.y < collide2.y + collide2.height &&
			collide1.y + collide1.height > collide2.y
		);
	}

	private _checkBallCollidePaddle(
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
		if (this._checkColide(ballColide, paddleColide)) {
			ball.direction.x *= -1;
			ball.velocity += GameParams.BALL_SPEED_INCREASE;
		}
	}

	private _normalizeDirection(ball: IBall) {
		const norm = Math.sqrt(
			ball.direction.x * ball.direction.x +
				ball.direction.y * ball.direction.y,
		);
		if (norm === 0) return;
		ball.direction.x /= norm;
		ball.direction.y /= norm;
	}

	private _updateBall(ball: IBall) {
		this._normalizeDirection(ball);
		const ballRadius: number = this._gameState.gameInfos.ballRadius;
		ball.position.x += ball.direction.x * ball.velocity;
		ball.position.y += ball.direction.y * ball.velocity;
		this._checkBallCollideWall(ball, ballRadius);
		this._checkBallCollidePaddle(
			ball,
			ballRadius,
			this._gameState.player1.paddle,
			this._gameState.gameInfos.paddleWidth,
			this._gameState.gameInfos.paddleHeight,
		);
		this._checkBallCollidePaddle(
			ball,
			ballRadius,
			this._gameState.player2.paddle,
			this._gameState.gameInfos.paddleWidth,
			this._gameState.gameInfos.paddleHeight,
		);
	}

	private _updateState() {
		this._updatePlayer(this._gameState.player1);
		this._updatePlayer(this._gameState.player2);
		this._updateBall(this._gameState.ball);
	}

	private async _game() {
		while (1) {
			await this._wait(20);
			this._updateState();
			this._sendStateToPlayers();
		}
	}
}
