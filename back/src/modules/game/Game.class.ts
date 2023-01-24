import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsService } from '../websockets/websockets.service';
import {
	convertStateToSendable,
	GameParams,
	GameStatus,
	getDefaultGameState,
	IBall,
	IGameState,
	IKeyEvent,
	IProfile,
	IPosition,
	IRect,
	IPlayer,
} from './Game.interfaces';

export class Game {
	private _websocketsService: WebsocketsService;
	private _prismaService: PrismaService;

	private _player1Profile: IProfile;
	private _player2Profile: IProfile;
	private _status: GameStatus = GameStatus.STARTING;

	private _startCounter: number = 10;
	private _gameStartTime: Date | null = null;

	private _gameState: IGameState;

	private _bounce: number = 0;

	private onEnd: () => void;

	constructor(
		player1Profile: IProfile,
		player2Profile: IProfile,
		_websocketsService: WebsocketsService,
		_prismaService: PrismaService,
	) {
		this._player1Profile = player1Profile;
		this._player2Profile = player2Profile;
		this._websocketsService = _websocketsService;
		this._prismaService = _prismaService;
		this._gameState = getDefaultGameState(player1Profile, player2Profile);
		this._resetBall(this._gameState.ball);
	}

	async start(onEnd: () => void) {
		this.onEnd = onEnd;
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
		if (!this._player1Profile || !this._player2Profile) return null;
		if (this._player1Profile.user.id === userId) {
			return this._gameState.player1;
		} else if (this._player2Profile.user.id === userId) {
			return this._gameState.player2;
		} else {
			return null;
		}
	}

	processInput(userId: number, data: IKeyEvent) {
		const player = this.getPlayer(userId);
		if (!player) return;
		if (data.action === 'press') {
			player.event = data.direction;
		}
		if (data.action === 'release') {
			player.event = null;
		}
	}

	async leave(userId: number) {
		const leaved = this.getPlayer(userId);
		const otherPlayer =
			this._gameState.player1.profile.user.id === leaved.profile.user.id
				? this._gameState.player2
				: this._gameState.player1;
		this._websocketsService.send(leaved.profile.socket, 'game-aborted', {
			reason: 'player-left',
			result: 'lose',
		});
		this._websocketsService.send(
			otherPlayer.profile.socket,
			'game-aborted',
			{
				reason: 'player-left',
				result: 'win',
			},
		);
		this._status = GameStatus.ABORTED;
		if (this._gameStartTime) {
			await this._prismaService.match.create({
				data: {
					createdAt:
						this._gameStartTime.toISOString() ||
						new Date().toISOString(),
					finishedAt: new Date().toISOString(),
					bounces: this._bounce,
					userOneId: this._player1Profile.user.id,
					userTwoId: this._player2Profile.user.id,
					winnerId: otherPlayer.profile.user.id,
					looserId: leaved.profile.user.id,
				},
			});
		}
		this.onEnd();
	}

	private async _wait(ms: number) {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}

	private _sendToPlayers(event: string, data: any) {
		this._websocketsService.send(this._player1Profile.socket, event, data);
		this._websocketsService.send(this._player2Profile.socket, event, data);
	}

	private _sendStateToPlayers(timeInSeconds: number) {
		const res = convertStateToSendable(this._gameState, timeInSeconds);
		res.player1.current = true;
		this._websocketsService.send(
			this._player1Profile.socket,
			'game-state',
			res,
		);
		res.player1.current = false;
		res.player2.current = true;
		this._websocketsService.send(
			this._player2Profile.socket,
			'game-state',
			res,
		);
	}

	private _updatePlayer(player: IPlayer) {
		if (player.event == null) return;
		if (player.event === 'up') {
			player.paddle.y -= GameParams.PADDLE_MOVE_SPEED;
			if (player.paddle.y < GameParams.PADDLE_BORDER)
				player.paddle.y = GameParams.PADDLE_BORDER;
		}
		if (player.event === 'down') {
			player.paddle.y += GameParams.PADDLE_MOVE_SPEED;
			if (
				player.paddle.y >
				this._gameState.gameInfos.height -
					this._gameState.gameInfos.paddleHeight -
					GameParams.PADDLE_BORDER
			)
				player.paddle.y =
					this._gameState.gameInfos.height -
					this._gameState.gameInfos.paddleHeight -
					GameParams.PADDLE_BORDER;
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
			this._gameState.player2.score++;
			this._resetBall(ball);
		}
		if (ball.position.x > this._gameState.gameInfos.width - ballRadius) {
			this._gameState.player1.score++;
			this._resetBall(ball);
		}
		if (ball.position.y < ballRadius) {
			ball.position.y = ballRadius;
			ball.direction.y *= -1;
			this._bounce++;
		}
		if (ball.position.y > this._gameState.gameInfos.height - ballRadius) {
			ball.position.y = this._gameState.gameInfos.height - ballRadius;
			ball.direction.y *= -1;
			this._bounce++;
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

	private async _disableCollision(ball: IBall) {
		ball.collidable = false;
		await this._wait(200);
		ball.collidable = true;
	}

	private _checkBallCollidePaddle(
		ball: IBall,
		ballRadius: number,
		paddle: IPosition,
		paddleWidth: number,
		paddleHeight: number,
	) {
		if (ball.collidable) {
			const ballColide: IRect = {
				x: ball.position.x - ballRadius,
				y: ball.position.y - ballRadius,
				width: ballRadius * 2,
				height: ballRadius * 2,
			};
			const paddleFrontUpCollideZone: IRect = {
				x: paddle.x,
				y: paddle.y,
				width: 2,
				height: paddleHeight / 3,
			};
			const paddleFrontMiddleCollideZone: IRect = {
				x: paddle.x,
				y: paddle.y + paddleHeight / 3,
				width: 2,
				height: paddleHeight / 3,
			};
			const paddleFrontDownCollideZone: IRect = {
				x: paddle.x,
				y: paddle.y + (paddleHeight / 3) * 2,
				width: 2,
				height: paddleHeight / 3,
			};
			const paddleTopCollideZone: IRect = {
				x: paddle.x,
				y: paddle.y - 2,
				width: paddleWidth,
				height: 2,
			};
			const paddleBottomCollideZone: IRect = {
				x: paddle.x,
				y: paddle.y + paddleHeight + 2,
				width: paddleWidth,
				height: 2,
			};
			if (this._checkColide(ballColide, paddleFrontUpCollideZone)) {
				ball.direction.x *= -1;
				ball.direction.y -= GameParams.BALL_PERTURBATOR;
				this._bounce++;
				ball.velocity += GameParams.BALL_SPEED_INCREASE;
				this._disableCollision(ball);
			} else if (
				this._checkColide(ballColide, paddleFrontMiddleCollideZone)
			) {
				ball.direction.x *= -1;
				this._bounce++;
				ball.velocity += GameParams.BALL_SPEED_INCREASE;
				this._disableCollision(ball);
			} else if (
				this._checkColide(ballColide, paddleFrontDownCollideZone)
			) {
				ball.direction.x *= -1;
				ball.direction.y += GameParams.BALL_PERTURBATOR;
				this._bounce++;
				ball.velocity += GameParams.BALL_SPEED_INCREASE;
				this._disableCollision(ball);
			} else if (this._checkColide(ballColide, paddleTopCollideZone)) {
				ball.direction.x *= -1;
				ball.direction.y *= -1;
				this._bounce++;
				this._disableCollision(ball);
			} else if (this._checkColide(ballColide, paddleBottomCollideZone)) {
				ball.direction.x *= -1;
				ball.direction.y *= -1;
				this._bounce++;
				this._disableCollision(ball);
			} else if (ball.velocity > GameParams.BALL_MAX_SPEED) {
				ball.velocity = GameParams.BALL_MAX_SPEED;
			}
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
		while (this._status === GameStatus.PLAYING) {
			await this._wait(20);
			const now = new Date();
			const timePlayed = now.getTime() - this._gameStartTime.getTime();
			const timeInSeconds = Math.floor(timePlayed / 1000);
			this._updateState();
			this._sendStateToPlayers(timeInSeconds);
			if (timeInSeconds >= GameParams.GAME_TIME) {
				if (
					this._gameState.player1.score !=
					this._gameState.player2.score
				)
					this._status = GameStatus.ENDED;
			}
		}
		if (this._status === GameStatus.ABORTED) {
			this.onEnd();
			return;
		}
		this._result();
	}

	private _result() {
		const now = new Date();
		const timePlayed = now.getTime() - this._gameStartTime.getTime();
		const timeInSeconds = Math.floor(timePlayed / 1000);
		const winner =
			this._gameState.player1.score > this._gameState.player2.score
				? this._gameState.player1
				: this._gameState.player2;
		const loser =
			winner == this._gameState.player1
				? this._gameState.player2
				: this._gameState.player1;
		this._registerGame(winner, loser);
		const res = {
			winner: {
				id: winner.profile.user.id,
				name: winner.profile.user.name,
				profile_picture: winner.profile.user.profile.picture,
				score: winner.score,
				position:
					winner.profile.user.id ===
					this._gameState.player1.profile.user.id
						? 1
						: 2,
			},
			loser: {
				id: loser.profile.user.id,
				name: loser.profile.user.name,
				profile_picture: loser.profile.user.profile.picture,
				score: loser.score,
				position:
					loser.profile.user.id ===
					this._gameState.player1.profile.user.id
						? 1
						: 2,
			},
			duration: timeInSeconds,
		};
		this._sendToPlayers('game-result', res);
		this.onEnd();
	}

	private async _registerGame(winner: IPlayer, loser: IPlayer) {
		await this._prismaService.match.create({
			data: {
				createdAt: this._gameStartTime.toISOString(),
				finishedAt: new Date().toISOString(),
				bounces: this._bounce,
				userOneId: this._player1Profile.user.id,
				userTwoId: this._player2Profile.user.id,
				winnerId: winner.profile.user.id,
				looserId: loser.profile.user.id,
			},
		});
	}
}
