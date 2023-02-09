import '@/style/play/Play.css';
import { useContext, useEffect, useRef, useState } from 'react';
import Matchmaking from '../play/Matchmaking';
import { ws_url as WS_URL, back_url } from '@/config.json';
import useWebSocket from 'react-use-websocket';
import PreGame from '../play/PreGame';
import Game from '../play/Game';
import GameResult from '../play/GameResult';
import { IGameResult } from '../play/GameInterfaces';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { UserContext } from '@/context/UserContext';

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
	const fetched = useRef(false);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

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
			async function fetchCurrentGame() {
				const token = await userContext.getAccessToken();
				fetch(back_url + '/game/invited', {
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + token,
					},
				})
					.then((res) => {
						if (res.ok) return res.json();
						else throw new Error('No game found');
					})
					.then((data) => {
						setPlayers([
							{ infos: data.player1, score: 0 },
							{ infos: data.player2, score: 0 },
						]);
						setGameState(GameState.PREGAME);
					})
					.catch((err) => {
						navigate('/play', { replace: true });
					});
			}

			const invite = location.search.includes('invite');
			if (invite && !fetched.current) {
				fetched.current = true;
				fetchCurrentGame();
			}

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
						Join a ranked game
					</button>
					<button
						className="play-btn fun-btn"
						onClick={() => {
							joinMatchmaking('fun');
						}}
					>
						Join a fun game
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
