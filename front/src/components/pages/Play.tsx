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
import { useLocation } from 'react-router';

export enum GameState {
	NO_GAME = 'no-game',
	LOBBY = 'lobby',
	MATCHMAKING = 'matchmaking',
	PREGAME = 'pregame',
	PLAYING = 'playing',
	RESULTS = 'results',
	SPECTATE = 'spectate',
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
	const location = useLocation();

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
		const spec = location.search.includes('spectate');
		setGameState(spec ? GameState.SPECTATE : GameState.LOBBY);
		if (!spec) {
			return () => {
				if (
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
				if (stateRef.current == GameState.MATCHMAKING) {
					sendMessage(
						JSON.stringify({
							event: 'matchmaking',
							data: { action: 'cancel' },
						}),
					);
				}
			};
		}
	}, []);

	useEffect(() => {
		stateRef.current = gameState;
	}, [gameState]);

	function endMatch(result: IGameResult) {
		setResult(result);
		setGameState(GameState.RESULTS);
	}

	function joinMatchmaking(type: 'ranked' | 'fun') {
		setGameState(GameState.MATCHMAKING);
		sendMessage(
			JSON.stringify({
				event: 'matchmaking',
				data: { action: 'join', type: type },
			}),
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
				<div className="lobby-btns">
					<button
						className="play-btn ranked-btn"
						onClick={() => {
							joinMatchmaking('ranked');
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 576 512"
						>
							<path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z" />
						</svg>
						<span>Join a ranked game</span>
					</button>
					<button
						className="play-btn fun-btn"
						onClick={() => {
							joinMatchmaking('fun');
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 512"
						>
							<path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 248c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40zm-24 56c0 22.1-17.9 40-40 40s-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z" />
						</svg>
						<span>Join a fun game</span>
					</button>
				</div>
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
				<Game spectator={false} players={players} endMatch={endMatch} />
			)}
			{gameState === GameState.RESULTS && result && (
				<GameResult result={result} />
			)}
			{gameState === GameState.SPECTATE && (
				<Game spectator={true} endMatch={endMatch} />
			)}
		</div>
	);
};

export default Play;
