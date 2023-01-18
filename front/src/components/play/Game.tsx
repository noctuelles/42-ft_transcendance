import { IGamePlayer } from '../pages/Play';
import PlayerCard, { PlayerCardType, PlayerPosition } from './PlayerCard';
import '@/style/play/Game.css';
import { useEffect, useRef } from 'react';

interface IGameProps {
	players: IGamePlayer[];
}

function Game(props: IGameProps) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas: any = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const width = canvas.width;
		const height = canvas.height;
		const paddle_height = 30;
		const paddle_width = 4;

		ctx.fillStyle = '#d9d9d9';
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.fill();

		ctx.fillStyle = '#000000';
		ctx.beginPath();
		ctx.arc(width / 2, height / 2, 3, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = '#ffb800';
		ctx.beginPath();
		ctx.rect(
			5,
			height / 2 - paddle_height / 2,
			paddle_width,
			paddle_height,
		);
		ctx.fill();

		ctx.fillStyle = '#17c0e9';
		ctx.beginPath();
		ctx.rect(
			width - 5 - paddle_width,
			height / 2 - paddle_height / 2,
			paddle_width,
			paddle_height,
		);
		ctx.fill();
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
