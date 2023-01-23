import { IGamePlayer } from '../pages/Play';

export interface IGameInfos {
	originalWidth: number;
	originalHeight: number;
	paddleHeight: number;
	paddleWidth: number;
	ballRadius: number;
	time: number;
}

export interface IPosition {
	x: number;
	y: number;
}

export interface IPlayer {
	infos: IGamePlayer;
	current: boolean;
	paddle: IPosition;
}

export interface IGameState {
	gameInfos: IGameInfos;
	player1: IPlayer;
	player2: IPlayer;
	ball: IPosition;
}

export interface IGameResult {
	winner: {
		id: number;
		name: string;
		profile_picture: string;
		score: number;
		position: 1 | 2;
	};
	loser: {
		id: number;
		name: string;
		profile_picture: string;
		score: number;
		position: 1 | 2;
	};
	duration: number;
}
