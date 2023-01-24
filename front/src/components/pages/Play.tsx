import '@/style/play/Play.css';
import { useContext, useEffect, useRef, useState } from 'react';
import Matchmaking from '../play/Matchmaking';
import { ws_url as WS_URL } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import PreGame from '../play/PreGame';
import Game from '../play/Game';
import GameResult from '../play/GameResult';
import { IGameResult } from '../play/GameInterfaces';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

export enum GameState {
	NO_GAME = 'no-game',
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
	const stateRef = useRef(GameState.LOBBY);
	const [players, setPlayers] = useState<IGamePlayer[]>([]);
	const [result, setResult] = useState<IGameResult | null>(null);
	const infoBoxContext = useContext(InfoBoxContext);

	function isGameAbortedEvent(data: any): boolean {
		return data.event === 'game-aborted';
	}

	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }) => {
			data = JSON.parse(data);
			if (data.data.reason === 'player-left') {
				if (data.data.result === 'win') {
					infoBoxContext.addInfo({
						type: InfoType.SUCCESS,
						message: 'Your opponent left the game and you won',
					});
				}
			}
			if (isGameAbortedEvent(data)) {
				setGameState(GameState.LOBBY);
			}
		},
		filter: ({ data }) => {
			return isGameAbortedEvent(JSON.parse(data));
		},
	});

	useEffect(() => {
		return () => {
			if (
				stateRef.current == GameState.MATCHMAKING ||
				stateRef.current == GameState.PREGAME ||
				stateRef.current == GameState.PLAYING
			) {
				stateRef.current = GameState.NO_GAME;
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message: 'You left the game and lost',
				});
				sendMessage(
					JSON.stringify({
						event: 'matchmaking',
						data: { action: 'leave' },
					}),
				);
			}
		};
	}, []);

	useEffect(() => {
		stateRef.current = gameState;
	}, [gameState]);

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
			{gameState === GameState.RESULTS && result && (
				<GameResult result={result} />
			)}
		</div>
	);
};

export default Play;
