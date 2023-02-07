export interface IProfile {
	socket: any;
	user: any;
}

export enum GameStatus {
	STARTING = 'starting',
	PLAYING = 'playing',
	ENDED = 'ended',
	ABORTED = 'aborted',
}

export enum GameType {
	RANKED = 'RANKED',
	FUN = 'FUN',
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

export interface IPlayer {
	profile: IProfile;
	paddle: IPosition;
	score: number;
	event: 'up' | 'down' | null;
}

export interface IBall {
	position: IPosition;
	direction: IPosition;
	velocity: number;
	collidable: boolean;
	portalUsable: boolean;
}

export interface IPortal {
	center: IPosition;
	width: number;
	height: number;
	link: IPortal;
	color: string;
	direction: 1 | -1;
	speed: number;
}

export interface IGameState {
	gameInfos: IGameInfos;
	player1: IPlayer;
	player2: IPlayer;
	ball: IBall;
	portals: IPortal[];
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
	PADDLE_MOVE_SPEED: 10,
	PADDLE_OFFSET: 50,
	PADDLE_BORDER: 2,
	PADDLE_HEIGHT: 120,
	PADDLE_WIDTH: 10,
	BALL_RADIUS: 15,
	BALL_DEFAULT_SPEED: 10,
	BALL_SPEED_INCREASE: 0.3,
	BALL_MAX_SPEED: 15,
	BALL_PERTURBATOR: 0.2,
	//TODO: change to 300
	GAME_TIME: 1000000,
	PORTAL_WIDTH: 20,
	PORTAL_HEIGHT: 40,
	PORTAL_OFFSET: 100,
	PORTAL_MIN_SPEED: 2,
	PORTAL_MAX_SPEED: 5,
};

function createDefaultPortal(
	center: IPosition,
	color: string,
	direction: 1 | -1,
): IPortal {
	return {
		center: center,
		width: GameParams.PORTAL_WIDTH,
		height: GameParams.PORTAL_HEIGHT,
		link: null,
		color: color,
		direction: direction,
		speed:
			Math.random() *
				(GameParams.PORTAL_MAX_SPEED - GameParams.PORTAL_MIN_SPEED) +
			GameParams.PORTAL_MIN_SPEED,
	};
}

export function getDefaultGameState(
	profile1: IProfile,
	profile2: IProfile,
	type: GameType,
): IGameState {
	let res = {
		gameInfos: {
			width: GameParams.GAME_WIDTH,
			height: GameParams.GAME_HEIGHT,
			paddleHeight: GameParams.PADDLE_HEIGHT,
			paddleWidth: GameParams.PADDLE_WIDTH,
			ballRadius: GameParams.BALL_RADIUS,
		},
		player1: {
			profile: profile1,
			paddle: {
				x: GameParams.PADDLE_OFFSET,
				y: GameParams.GAME_HEIGHT / 2 - GameParams.PADDLE_HEIGHT / 2,
			},
			score: 0,
			event: null,
		},
		player2: {
			profile: profile2,
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
				x: 0,
				y: 0,
			},
			collidable: true,
			velocity: GameParams.BALL_DEFAULT_SPEED,
			portalUsable: true,
		},
		portals: [],
	};
	if (type === GameType.FUN) {
		let portals = [
			createDefaultPortal(
				{
					x:
						GameParams.GAME_WIDTH / 2 -
						GameParams.PORTAL_WIDTH / 2 -
						GameParams.PORTAL_OFFSET,
					y:
						GameParams.GAME_HEIGHT -
						GameParams.PORTAL_OFFSET -
						GameParams.PORTAL_HEIGHT / 2,
				},
				'#c3a749',
				-1,
			),
			createDefaultPortal(
				{
					x:
						GameParams.GAME_WIDTH / 2 +
						GameParams.PORTAL_WIDTH / 2 +
						GameParams.PORTAL_OFFSET,
					y: GameParams.PORTAL_OFFSET + GameParams.PORTAL_HEIGHT / 2,
				},
				'#701415',
				1,
			),
		];
		portals[0].link = portals[1];
		portals[1].link = portals[0];
		res.portals = portals;
	}
	return res;
}

export function convertStateToSendable(
	state: IGameState,
	timeInSeconds: number,
) {
	let res = {
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
	if (state.portals.length > 0) {
		res['portals'] = state.portals.map((portal: any) => {
			return {
				center: portal.center,
				width: portal.width,
				height: portal.height,
				color: portal.color,
			};
		});
	}
	return res;
}

export function convertStateToSendableForSpectators(
	state: IGameState,
	timeInSeconds: number,
) {
	let res = convertStateToSendable(state, timeInSeconds);
	res.player1['name'] = state.player1.profile.user.name;
	res.player1['profile_picture'] = state.player1.profile.user.profile.picture;
	res.player2['name'] = state.player2.profile.user.name;
	res.player2['profile_picture'] = state.player2.profile.user.profile.picture;
	return res;
}
