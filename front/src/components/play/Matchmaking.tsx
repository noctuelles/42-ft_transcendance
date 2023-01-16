import { GameState } from '../pages/Play';
import '@/style/play/Matchmaking.css';
import Loader from '../global/Loader';

interface IMatchmakingProps {
	setGameState: (gameState: GameState) => void;
}

function Matchmaking(props: IMatchmakingProps) {
	return (
		<div className="matchmaking">
			<h1>Waiting for opponent...</h1>
			<Loader color="black" />
			<button
				className="matchmaking-btn"
				onClick={() => {
					props.setGameState(GameState.LOBBY);
				}}
			>
				Cancel
			</button>
		</div>
	);
}

export default Matchmaking;
