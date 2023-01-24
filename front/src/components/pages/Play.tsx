import '@/style/play/Play.css';
import { useState } from 'react';
import Matchmaking from '../play/Matchmaking';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import PreGame from '../play/PreGame';
import Game from '../play/Game';
import GameResult from '../play/GameResult';
import { IGameResult } from '../play/GameInterfaces';

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
	score: number;
}

const Play = () => {
	const [gameState, setGameState] = useState(GameState.LOBBY);
	const [players, setPlayers] = useState<IGamePlayer[]>([]);
	const [result, setResult] = useState<IGameResult | null>(null);

	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
	});

	function endMatch(result: IGameResult) {
		setResult(result);
		setGameState(GameState.RESULTS);
	}

	function joinMatchmaking() {
		setGameState(GameState.MATCHMAKING);
		sendMessage(
			JSON.stringify({ event: 'matchmaking', data: { action: 'join' } }),
		);
	}

	function joinMatch(player1: IPlayerInfo, player2: IPlayerInfo) {
		setPlayers([
			{ infos: player1, score: 0 },
			{ infos: player2, score: 0 },
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
				<PreGame players={players} setGameState={setGameState} />
			)}
			{gameState === GameState.PLAYING && (
				<Game players={players} endMatch={endMatch} />
			)}
			{gameState === GameState.RESULTS && <GameResult result={result} />}
		</div>
	);
};

export default Play;
