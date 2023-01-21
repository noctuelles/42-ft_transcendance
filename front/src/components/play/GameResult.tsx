import { IGameResult } from './GameInterfaces';

interface IGameResultProps {
	result: IGameResult;
}

function GameResult(props: IGameResultProps) {
	return (
		<div className="game-result">
			<h1>Game over</h1>
		</div>
	);
}

export default GameResult;
