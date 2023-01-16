import '@/style/play/Play.css';
import { useState } from 'react';
import Matchmaking from '../play/Matchmaking';

export enum GameState {
	LOBBY = 'lobby',
	MATCHMAKING = 'matchmaking',
	PLAYING = 'playing',
	RESULTS = 'results',
}

const Play = () => {
	const [gameState, setGameState] = useState(GameState.LOBBY);
	return (
		<div className={`play play-state-${gameState}`}>
			{gameState === GameState.LOBBY && (
				<button
					className="play-btn"
					onClick={() => {
						setGameState(GameState.MATCHMAKING);
					}}
				>
					Join a game
				</button>
			)}
			{gameState === GameState.MATCHMAKING && (
				<Matchmaking setGameState={setGameState} />
			)}
		</div>
	);
};

export default Play;
