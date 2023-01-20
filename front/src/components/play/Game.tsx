import { IGamePlayer } from '../pages/Play';
import PlayerCard, { PlayerCardType, PlayerPosition } from './PlayerCard';
import '@/style/play/Game.css';
import { useEffect, useRef, useState } from 'react';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import { drawState } from './CanvasUtils';
import Timer from './Timer';

interface IGameProps {
	players: IGamePlayer[];
}

function Game(props: IGameProps) {
	const canvasRef = useRef(null);
	const [time, setTime] = useState(300);
	const [players, setPlayers] = useState([...props.players]);

	function isGameStateEvent(data: any) {
		return data.event === 'game-state';
	}

	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }) => {
			data = JSON.parse(data);
			if (isGameStateEvent(data)) {
				setTime(data.data.gameInfos.time);
				setPlayers([
					{ ...players[0], score: data.data.player1.score },
					{ ...players[1], score: data.data.player2.score },
				]);
				drawState(data.data, canvasRef);
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
					player={players[0]}
					position={PlayerPosition.LEFT}
					type={PlayerCardType.DURING_GAME}
				/>
				<Timer time={time} />
				<PlayerCard
					player={players[1]}
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
