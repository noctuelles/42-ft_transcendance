import { AchievementType } from '@prisma/client';
import { time } from 'console';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementsService } from '../users/achievments.service';
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
	GameType,
	IPortal,
	convertStateToSendableForSpectators,
} from './Game.interfaces';

export class Game {
	private _websocketsService: WebsocketsService;
	private _prismaService: PrismaService;
	private _achievementsService: AchievementsService;

	private _player1Profile: IProfile;
	private _player2Profile: IProfile;
	private _status: GameStatus = GameStatus.STARTING;
	private _type: GameType;

	private _spectatorSockets: any[] = [];

	private _startCounter: number = 10;
	private _gameStartTime: Date | null = null;

	private _gameState: IGameState;

	private _bounceP1: number = 0;
	private _bounceP2: number = 0;
	private _portalsUsedP1: number = 0;
	private _portalsUsedP2: number = 0;

	private onEnd: () => void;

	constructor(
		player1Profile: IProfile,
		player2Profile: IProfile,
		websocketsService: WebsocketsService,
		prismaService: PrismaService,
		achievementsService: AchievementsService,
		type: GameType,
	) {
		this._player1Profile = player1Profile;
		this._player2Profile = player2Profile;
		this._websocketsService = websocketsService;
		this._prismaService = prismaService;
		this._achievementsService = achievementsService;
		this._type = type;
		this._gameState = getDefaultGameState(
			player1Profile,
			player2Profile,
			type,
		);
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
		this._setPlayersStatus('PLAYING');
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

	getSpectator(userId: number): IPlayer | null {
		return this._spectatorSockets.find((s) => s.user.id === userId);
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
			const now = new Date();
			const timePlayed = now.getTime() - this._gameStartTime.getTime();
			const timeInSeconds = Math.floor(timePlayed / 1000);
			this._registerGame(otherPlayer, leaved, timeInSeconds);
		}
		this._setPlayersStatus('ONLINE');
		this.onEnd();
	}

	addSpectator(socket: any) {
		this._spectatorSockets.push(socket);
	}

	removeSpectator(socket: any) {
		this._spectatorSockets = this._spectatorSockets.filter(
			(s) => s !== socket,
		);
	}

	private async _wait(ms: number) {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}

	async _setPlayersStatus(status: 'ONLINE' | 'PLAYING') {
		await this._prismaService.user.updateMany({
			where: {
				OR: [
					{ id: this._player1Profile.user.id },
					{ id: this._player2Profile.user.id },
				],
			},
			data: { status: status },
		});
		this._websocketsService.broadcast('user-status', {
			id: this._player1Profile.user.id,
			status: status,
		});
		this._websocketsService.broadcast('user-status', {
			id: this._player2Profile.user.id,
			status: status,
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

	private _sendStateToSpectators(timeInSeconds: number) {
		const res = convertStateToSendableForSpectators(
			this._gameState,
			timeInSeconds,
		);
		this._websocketsService.sendToAll(
			this._spectatorSockets,
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
			let res = false;
			if (this._checkColide(ballColide, paddleFrontUpCollideZone)) {
				ball.direction.x *= -1;
				ball.direction.y -= GameParams.BALL_PERTURBATOR;
				ball.velocity += GameParams.BALL_SPEED_INCREASE;
				this._disableCollision(ball);
				res = true;
			} else if (
				this._checkColide(ballColide, paddleFrontMiddleCollideZone)
			) {
				ball.direction.x *= -1;
				ball.velocity += GameParams.BALL_SPEED_INCREASE;
				this._disableCollision(ball);
				res = true;
			} else if (
				this._checkColide(ballColide, paddleFrontDownCollideZone)
			) {
				ball.direction.x *= -1;
				ball.direction.y += GameParams.BALL_PERTURBATOR;
				ball.velocity += GameParams.BALL_SPEED_INCREASE;
				this._disableCollision(ball);
				res = true;
			} else if (this._checkColide(ballColide, paddleTopCollideZone)) {
				ball.direction.x *= -1;
				ball.direction.y *= -1;
				this._disableCollision(ball);
				res = true;
			} else if (this._checkColide(ballColide, paddleBottomCollideZone)) {
				ball.direction.x *= -1;
				ball.direction.y *= -1;
				this._disableCollision(ball);
				res = true;
			}
			if (ball.velocity > GameParams.BALL_MAX_SPEED) {
				ball.velocity = GameParams.BALL_MAX_SPEED;
			}
			return res;
		}
	}

	private _setBallInvunlerableToPortal(ball: IBall) {
		ball.portalUsable = false;
		setTimeout(() => {
			ball.portalUsable = true;
		}, 200);
	}

	private _checkBallCollidePortal(
		ball: IBall,
		ballRadius: number,
		portal: IPortal,
	) {
		if (ball.portalUsable) {
			const ballColide: IRect = {
				x: ball.position.x - ballRadius,
				y: ball.position.y - ballRadius,
				width: ballRadius * 2,
				height: ballRadius * 2,
			};
			const portalCollide: IRect = {
				x: portal.center.x - portal.width / 2 + 2,
				y: portal.center.y - portal.height / 2,
				width: portal.width * 2 - 4,
				height: portal.height * 2,
			};
			if (this._checkColide(ballColide, portalCollide)) {
				ball.position.x = portal.link.center.x;
				ball.position.y = portal.link.center.y;
				this._setBallInvunlerableToPortal(ball);
				if (ball.direction.x > 0) {
					this._portalsUsedP1++;
				} else {
					this._portalsUsedP2++;
				}
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
		if (
			this._checkBallCollidePaddle(
				ball,
				ballRadius,
				this._gameState.player1.paddle,
				this._gameState.gameInfos.paddleWidth,
				this._gameState.gameInfos.paddleHeight,
			)
		) {
			this._bounceP1++;
		}
		if (
			this._checkBallCollidePaddle(
				ball,
				ballRadius,
				this._gameState.player2.paddle,
				this._gameState.gameInfos.paddleWidth,
				this._gameState.gameInfos.paddleHeight,
			)
		) {
			this._bounceP2++;
		}
		this._gameState.portals.forEach((portal) => {
			this._checkBallCollidePortal(ball, ballRadius, portal);
		});
	}

	private _updatePortal(portal: IPortal) {
		portal.center.y += portal.speed * portal.direction;
		if (
			portal.center.y <
			portal.height / 2 + GameParams.PORTAL_OFFSET / 2
		) {
			portal.direction = 1;
		}
		if (
			portal.center.y >
			GameParams.GAME_HEIGHT -
				portal.height / 2 -
				GameParams.PORTAL_OFFSET / 2
		) {
			portal.direction = -1;
		}
	}

	private _updateState() {
		this._updatePlayer(this._gameState.player1);
		this._updatePlayer(this._gameState.player2);
		this._updateBall(this._gameState.ball);
		this._gameState.portals.forEach((portal) => {
			this._updatePortal(portal);
		});
	}

	private async _game() {
		while (this._status === GameStatus.PLAYING) {
			await this._wait(20);
			const now = new Date();
			const timePlayed = now.getTime() - this._gameStartTime.getTime();
			const timeInSeconds = Math.floor(timePlayed / 1000);
			this._updateState();
			this._sendStateToPlayers(timeInSeconds);
			this._sendStateToSpectators(timeInSeconds);
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
		this._registerGame(winner, loser, timeInSeconds);
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
		this._websocketsService.sendToAll(
			this._spectatorSockets,
			'game-result',
			res,
		);
		this.onEnd();
	}

	private async _registerGame(
		winner: IPlayer,
		loser: IPlayer,
		timeInSeconds: number,
	) {
		const winnerXP = 50;
		const loserXP = 0;
		let eloChange = 0;
		if (this._type === GameType.RANKED) {
			let eloDiff = Math.abs(
				winner.profile.user.profile.elo -
					loser.profile.user.profile.elo,
			);
			if (eloDiff > 1000) eloDiff = 1000;
			eloDiff /= 400;
			eloDiff = Math.pow(10, eloDiff) + 1;
			let score = 1 / eloDiff;
			score = Math.round((1 - score) * 20);
			eloChange = score;
		}

		const user1 = this._player1Profile.user;
		const isUser1Winner = user1.id === winner.profile.user.id;
		const user2 = this._player2Profile.user;
		const isUser2Winner = user2.id === winner.profile.user.id;

		let promises = [];
		promises.push(
			this._prismaService.match.create({
				data: {
					createdAt: this._gameStartTime.toISOString(),
					finishedAt: new Date().toISOString(),
					type: this._type,
					userOne: {
						create: {
							userId: user1.id,
							score: isUser1Winner ? winner.score : loser.score,
							xpAtBeg: user1.profile.xp,
							xpEarned: isUser1Winner ? winnerXP : loserXP,
							eloAtBeg: user1.profile.elo,
							eloEarned: isUser1Winner ? eloChange : -eloChange,
							winner: isUser1Winner,
							bounces: this._bounceP1,
							portalsUsed: this._portalsUsedP1,
						},
					},
					userTwo: {
						create: {
							userId: user2.id,
							score: isUser2Winner ? winner.score : loser.score,
							xpAtBeg: user2.profile.xp,
							xpEarned: isUser2Winner ? winnerXP : loserXP,
							eloAtBeg: user2.profile.elo,
							eloEarned: isUser2Winner ? eloChange : -eloChange,
							winner: isUser2Winner,
							bounces: this._bounceP2,
							portalsUsed: this._portalsUsedP2,
						},
					},
				},
			}),
		);
		promises.push(
			this._prismaService.user.update({
				where: { id: winner.profile.user.id },
				data: {
					profile: {
						update: {
							xp: {
								increment: winnerXP,
							},
							elo: {
								increment: eloChange,
							},
							wonMatches: {
								increment: 1,
							},
						},
					},
				},
			}),
		);
		promises.push(
			this._prismaService.user.update({
				where: { id: loser.profile.user.id },
				data: {
					profile: {
						update: {
							xp: {
								increment: loserXP,
							},
							elo: {
								increment: -eloChange,
							},
							lostMatches: {
								increment: 1,
							},
						},
					},
				},
			}),
		);
		this._achievementsService.progressAchievements(
			winner.profile.user.profile.id,
			[
				AchievementType.NEW_SUBJECT,
				AchievementType.WHEATLEY,
				AchievementType.P_BODY,
				AchievementType.GLADOS,
				AchievementType.APPRENTICE,
				AchievementType.LEARNER,
				AchievementType.EXPERT,
				AchievementType.STREAKER,
				AchievementType.MASTER_STREAKER,
			],
			1,
		);
		this._achievementsService.progressAchievements(
			loser.profile.user.profile.id,
			[
				AchievementType.NEW_SUBJECT,
				AchievementType.WHEATLEY,
				AchievementType.P_BODY,
				AchievementType.GLADOS,
			],
			1,
		);
		this._achievementsService.setAchievements(
			loser.profile.user.profile.id,
			[AchievementType.STREAKER, AchievementType.MASTER_STREAKER],
			0,
		);
		this._achievementsService.progressAchievements(
			user1.profile.id,
			[AchievementType.BOUNCER, AchievementType.PROFFESIONAL_BOUNCER],
			this._bounceP1,
		);
		this._achievementsService.progressAchievements(
			user2.profile.id,
			[AchievementType.BOUNCER, AchievementType.PROFFESIONAL_BOUNCER],
			this._bounceP2,
		);
		this._achievementsService.progressAchievements(
			user1.profile.id,
			[AchievementType.PORTALS_USER, AchievementType.PORTALS_ADDICT],
			this._portalsUsedP1,
		);
		this._achievementsService.progressAchievements(
			user2.profile.id,
			[AchievementType.PORTALS_USER, AchievementType.PORTALS_ADDICT],
			this._portalsUsedP2,
		);
		this._achievementsService.setAchievements(
			winner.profile.user.profile.id,
			[
				AchievementType.CHAMPION,
				AchievementType.MASTER,
				AchievementType.LEGEND,
			],
			winner.profile.user.profile.elo + eloChange,
		);
		this._achievementsService.setAchievements(
			loser.profile.user.profile.id,
			[
				AchievementType.CHAMPION,
				AchievementType.MASTER,
				AchievementType.LEGEND,
			],
			winner.profile.user.profile.elo - eloChange,
		);
		if (timeInSeconds > GameParams.GAME_TIME) {
			this._achievementsService.setAchievement(
				winner.profile.user.profile.id,
				AchievementType.ENDURANT,
				1,
			);
			this._achievementsService.setAchievement(
				loser.profile.user.profile.id,
				AchievementType.ENDURANT,
				1,
			);
		}
		if (timeInSeconds > 10 * 60) {
			this._achievementsService.setAchievement(
				winner.profile.user.profile.id,
				AchievementType.SEMI_MARATHON,
				1,
			);
			this._achievementsService.setAchievement(
				loser.profile.user.profile.id,
				AchievementType.SEMI_MARATHON,
				1,
			);
		}
		if (timeInSeconds > 20 * 60) {
			this._achievementsService.setAchievement(
				winner.profile.user.profile.id,
				AchievementType.MARATHON,
				1,
			);
			this._achievementsService.setAchievement(
				loser.profile.user.profile.id,
				AchievementType.MARATHON,
				1,
			);
		}
		await Promise.all(promises);
	}
}
