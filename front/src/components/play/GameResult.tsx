import { IGameResult } from './GameInterfaces';
import '@/style/play/GameResult.css';
import PlayerResult from '@/components/play/PlayerResult';

interface IGameResultProps {
	result: IGameResult;
}

function GameResult(props: IGameResultProps) {
	return (
		<div className="game-result">
			<h1 className="result-title">Game over</h1>
			<div className="result-profiles">
				<PlayerResult
					name={props.result.winner.name}
					profile_picture={props.result.winner.profile_picture}
					score={props.result.winner.score}
					winner={true}
					color={
						props.result.winner.position == 1
							? '#ffb800'
							: '#17c0e9'
					}
				/>
				<PlayerResult
					name={props.result.loser.name}
					profile_picture={props.result.loser.profile_picture}
					score={props.result.loser.score}
					winner={true}
					color={
						props.result.loser.position == 1 ? '#ffb800' : '#17c0e9'
					}
				/>
			</div>
		</div>
	);
}

export default GameResult;
