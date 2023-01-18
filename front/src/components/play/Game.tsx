import { IGamePlayer } from '../pages/Play';
import PlayerCard, { PlayerCardType, PlayerPosition } from './PlayerCard';
import '@/style/play/Game.css';
import { useEffect, useRef } from 'react';
import { drawBall, drawPaddle } from './CanvasUtils';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';

interface IGameProps {
	players: IGamePlayer[];
}

export interface IGameInfos {
	originalWidth: number;
	originalHeight: number;
	paddleHeight: number;
	paddleWidth: number;
	ballRadius: number;
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

interface IGameState {
	gameInfos: IGameInfos;
	player1: IPlayer;
	player2: IPlayer;
	ball: IPosition;
}

function Game(props: IGameProps) {
	const canvasRef = useRef(null);

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

	function isGameStateEvent(data: any) {
		return data.event === 'game-state';
	}

	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }) => {
			data = JSON.parse(data);
			if (isGameStateEvent(data)) {
				drawState(data.data);
			}
		},
		filter: ({ data }) => {
			return isGameStateEvent(JSON.parse(data));
		},
	});

	function onKey(event: KeyboardEvent, action: string) {
		switch (event.key) {
			case 'ArrowUp':
				sendMessage(
					JSON.stringify({
						event: 'game-input',
						data: { action: action, direction: 'up' },
					}),
				);
				break;
			case 'ArrowDown':
				sendMessage(
					JSON.stringify({
						event: 'game-input',
						data: { action: action, direction: 'down' },
					}),
				);
				break;
		}
	}

	function onKeyRelease(event: KeyboardEvent) {
		onKey(event, 'release');
	}

	function onKeyPress(event: KeyboardEvent) {
		onKey(event, 'press');
	}

	useEffect(() => {
		window.addEventListener('keydown', onKeyPress);
		window.addEventListener('keyup', onKeyRelease);

		return () => {
			window.removeEventListener('keydown', onKeyPress);
			window.removeEventListener('keyup', onKeyRelease);
		};
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
