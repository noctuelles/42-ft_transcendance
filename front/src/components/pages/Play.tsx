import '@/style/play/Play.css';
import { useState } from 'react';
import Matchmaking from '../play/Matchmaking';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import PreGame from '../play/PreGame';

export enum GameState {
	LOBBY = 'lobby',
	MATCHMAKING = 'matchmaking',
	PREGAME = 'pregame',
	PLAYING = 'playing',
	RESULTS = 'results',
}

export interface IPlayerInfo {
	name: string;
	profile_picture: string;
}

export interface IGamePlayer {
	infos: IPlayerInfo;
	points: number;
}

const Play = () => {
	const [gameState, setGameState] = useState(GameState.LOBBY);
	const [players, setPlayers] = useState<IGamePlayer[]>([]);

	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
	});

	function joinMatchmaking() {
		setGameState(GameState.MATCHMAKING);
		sendMessage(
			JSON.stringify({ event: 'matchmaking', data: { action: 'join' } }),
		);
	}

	function joinMatch(player1: IPlayerInfo, player2: IPlayerInfo) {
		setPlayers([
			{ infos: player1, points: 0 },
			{ infos: player2, points: 0 },
		]);
		setGameState(GameState.PREGAME);
	}

	return (
		<div className={`play play-state-${gameState}`}>
			{gameState === GameState.LOBBY && (
				<button className="play-btn" onClick={joinMatchmaking}>
					Join a game
				</button>
			)}
			{gameState === GameState.MATCHMAKING && (
				<Matchmaking
					setGameState={setGameState}
					joinMatch={joinMatch}
				/>
			)}
			{gameState === GameState.PREGAME && (
				<PreGame
					players={players.map((p) => p.infos)}
					setGameState={setGameState}
				/>
			)}
		</div>
	);
};

export default Play;
