import { User } from '@prisma/client';

export interface IPlayer {
	socket: any;
	user: User;
}

export enum GameStatus {
	STARTING = 'starting',
	PLAYING = 'playing',
	ENDED = 'ended',
}

export interface IGameInfos {
	width: number;
	height: number;
	paddleHeight: number;
	paddleWidth: number;
	ballRadius: number;
}

export interface IPosition {
	x: number;
	y: number;
}

export interface IPlayerInfos {
	infos: IPlayer;
	paddle: IPosition;
	score: number;
	event: 'up' | 'down' | null;
}

export interface IBall {
	position: IPosition;
	direction: IPosition;
	velocity: number;
}

export interface IGameState {
	gameInfos: IGameInfos;
	player1: IPlayerInfos;
	player2: IPlayerInfos;
	ball: IBall;
}

export interface IKeyEvent {
	action: 'release' | 'press';
	direction: 'up' | 'down';
}

export interface IRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export const GameParams = {
	GAME_WIDTH: 1600,
	GAME_HEIGHT: 900,
	PADDLE_OFFSET: 50,
	PADDLE_HEIGHT: 120,
	PADDLE_WIDTH: 10,
	BALL_RADIUS: 15,
	BALL_DEFAULT_SPEED: 10,
	BALL_SPEED_INCREASE: 1,
	GAME_TIME: 300,
};

export function getDefaultGameState(
	player1: IPlayer,
	player2: IPlayer,
): IGameState {
	return {
		gameInfos: {
			width: GameParams.GAME_WIDTH,
			height: GameParams.GAME_HEIGHT,
			paddleHeight: GameParams.PADDLE_HEIGHT,
			paddleWidth: GameParams.PADDLE_WIDTH,
			ballRadius: GameParams.BALL_RADIUS,
		},
		player1: {
			infos: player1,
			paddle: {
				x: GameParams.PADDLE_OFFSET,
				y: GameParams.GAME_HEIGHT / 2 - GameParams.PADDLE_HEIGHT / 2,
			},
			score: 0,
			event: null,
		},
		player2: {
			infos: player2,
			paddle: {
				x:
					GameParams.GAME_WIDTH -
					GameParams.PADDLE_OFFSET -
					GameParams.PADDLE_WIDTH,
				y: GameParams.GAME_HEIGHT / 2 - GameParams.PADDLE_HEIGHT / 2,
			},
			score: 0,
			event: null,
		},
		ball: {
			position: {
				x: GameParams.GAME_WIDTH / 2,
				y: GameParams.GAME_HEIGHT / 2,
			},
			direction: {
				x: Math.random() * (Math.random() < 0.5 ? -1 : 1),
				y: (Math.random() / 3) * (Math.random() < 0.5 ? -1 : 1),
			},
			velocity: GameParams.BALL_DEFAULT_SPEED,
		},
	};
}

export function convertStateToSendable(state: any, startDate: Date) {
	const now = new Date();
	const timePlayed = now.getTime() - startDate.getTime();
	const timeInSeconds = timePlayed / 1000;
	return {
		gameInfos: {
			originalWidth: state.gameInfos.width,
			originalHeight: state.gameInfos.height,
			paddleWidth: state.gameInfos.paddleWidth,
			paddleHeight: state.gameInfos.paddleHeight,
			ballRadius: state.gameInfos.ballRadius,
			time: GameParams.GAME_TIME - timeInSeconds,
		},
		player1: {
			paddle: {
				x: state.player1.paddle.x,
				y: state.player1.paddle.y,
			},
			score: state.player1.score,
			current: false,
		},
		player2: {
			paddle: {
				x: state.player2.paddle.x,
				y: state.player2.paddle.y,
			},
			score: state.player2.score,
			current: false,
		},
		ball: {
			x: state.ball.position.x,
			y: state.ball.position.y,
		},
	};
}
