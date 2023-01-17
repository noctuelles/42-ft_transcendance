import { GameState, IPlayerInfo } from '../pages/Play';
import PlayerCard, { PlayerCardType, PlayerPosition } from './PlayerCard';
import '@/style/play/PreGame.css';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

interface IPreGameProps {
	players: IPlayerInfo[];
	setGameState: (gameState: GameState) => void;
}

function PreGame(props: IPreGameProps) {
	const [time, setTime] = useState(10);

	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }) => {
			data = JSON.parse(data);
			if (data.event === 'match-starting') {
				setTime(data.data.time);
			}
			if (time === 0) {
				props.setGameState(GameState.PLAYING);
			}
		},
		filter: ({ data }) => {
			return data.event === 'match-starting';
		},
	});

	return (
		<div className="pre-game">
			<div className="pre-game-players">
				<PlayerCard
					player={props.players[0]}
					position={PlayerPosition.LEFT}
					type={PlayerCardType.BEFORE_GAME}
				/>
				<PlayerCard
					player={props.players[1]}
					position={PlayerPosition.RIGHT}
					type={PlayerCardType.BEFORE_GAME}
				/>
			</div>
			<h1 className="pregame-counter">Start in {time} ...</h1>
		</div>
	);
}

export default PreGame;
