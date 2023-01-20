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

export function getDefaultGameState(
	player1: IPlayer,
	player2: IPlayer,
): IGameState {
	return {
		gameInfos: {
			width: 1600,
			height: 900,
			paddleHeight: 120,
			paddleWidth: 10,
			ballRadius: 15,
		},
		player1: {
			infos: player1,
			paddle: {
				x: 50,
				y: 390,
			},
			event: null,
		},
		player2: {
			infos: player2,
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
				y: (Math.random() / 3) * (Math.random() < 0.5 ? -1 : 1),
			},
			velocity: 10,
		},
	};
}

export function convertStateToSendable(state: any) {
	return {
		gameInfos: {
			originalWidth: state.gameInfos.width,
			originalHeight: state.gameInfos.height,
			paddleWidth: state.gameInfos.paddleWidth,
			paddleHeight: state.gameInfos.paddleHeight,
			ballRadius: state.gameInfos.ballRadius,
		},
		player1: {
			paddle: {
				x: state.player1.paddle.x,
				y: state.player1.paddle.y,
			},
			current: false,
		},
		player2: {
			paddle: {
				x: state.player2.paddle.x,
				y: state.player2.paddle.y,
			},
			current: false,
		},
		ball: {
			x: state.ball.position.x,
			y: state.ball.position.y,
		},
	};
}
