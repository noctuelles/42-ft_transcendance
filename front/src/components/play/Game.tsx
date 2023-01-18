import { IGamePlayer } from '../pages/Play';
import PlayerCard, { PlayerCardType, PlayerPosition } from './PlayerCard';
import '@/style/play/Game.css';
import { useEffect, useRef } from 'react';

interface IGameProps {
	players: IGamePlayer[];
}

interface IGameInfos {
	originalWidth: number;
	originalHeight: number;
	paddle_height: number;
	paddle_width: number;
	ball_radius: number;
}

interface IPosition {
	x: number;
	y: number;
}

interface IPlayer {
	infos: IGamePlayer;
	current: boolean;
	paddle: IPosition;
}

interface IGameState {
	gameInfos: IGameInfos;
	player1: IPlayer;
	player2: IPlayer;
	ball: IPosition;
}

function Game(props: IGameProps) {
	const canvasRef = useRef(null);

	function drawRect(
		ctx: any,
		color: string,
		x: number,
		y: number,
		width: number,
		height: number,
	) {
		ctx.fillStyle = color;
		ctx.beginPath();
		for (let i = 0; i < width; i++) {
			ctx.rect(x + i, y, 1, height);
		}
		ctx.fill();
	}

	function drawPaddle(
		ctx: any,
		player: IPlayer,
		color: string,
		gameInfos: IGameInfos,
	) {
		if (player.current) {
			drawRect(
				ctx,
				'#ff0000',
				player.paddle.x - 2,
				player.paddle.y - 2,
				gameInfos.paddle_width + 4,
				gameInfos.paddle_height + 4,
			);
		}
		drawRect(
			ctx,
			color,
			player.paddle.x,
			player.paddle.y,
			gameInfos.paddle_width,
			gameInfos.paddle_height,
		);
	}

	function drawBall(
		ctx: any,
		color: string,
		ball: IPosition,
		gameInfos: IGameInfos,
	) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(
			ball.x + gameInfos.ball_radius / 2,
			ball.y + gameInfos.ball_radius / 2,
			gameInfos.ball_radius,
			0,
			2 * Math.PI,
		);
		ctx.fill();
	}

	function drawState(state: IGameState) {
		const canvas: any = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.canvas.width = state.gameInfos.originalWidth;
		ctx.canvas.height = state.gameInfos.originalHeight;

		ctx.translate(0.5, 0.5);

		ctx.fillStyle = '#d9d9d9';
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fill();

		drawBall(ctx, '#000000', state.ball, state.gameInfos);

		drawPaddle(ctx, state.player1, '#ffb800', state.gameInfos);

		drawPaddle(ctx, state.player2, '#17c0e9', state.gameInfos);
	}

	useEffect(() => {
		const gameState = {
			gameInfos: {
				originalWidth: 1600,
				originalHeight: 900,
				paddle_height: 120,
				paddle_width: 10,
				ball_radius: 15,
			},
			player1: {
				infos: props.players[0],
				current: true,
				paddle: {
					x: 10,
					y: 390,
				},
			},
			player2: {
				infos: props.players[1],
				current: false,
				paddle: {
					x: 1580,
					y: 390,
				},
			},
			ball: {
				x: 800,
				y: 450,
			},
		};
		drawState(gameState);
	}, []);

	return (
		<div className="game">
			<div className="game-players">
				<PlayerCard
					player={props.players[0]}
					position={PlayerPosition.LEFT}
					type={PlayerCardType.DURING_GAME}
				/>
				<p className="game-timer">04:45</p>
				<PlayerCard
					player={props.players[1]}
					position={PlayerPosition.RIGHT}
					type={PlayerCardType.DURING_GAME}
				/>
			</div>
			<div className="game-content">
				<canvas ref={canvasRef} className="game-canvas" />
			</div>
		</div>
	);
}

export default Game;
