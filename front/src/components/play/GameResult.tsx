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
							? 'var(--yellow-primary-color)'
							: 'var(--blue-primary-color)'
					}
				/>
				<PlayerResult
					name={props.result.loser.name}
					profile_picture={props.result.loser.profile_picture}
					score={props.result.loser.score}
					winner={true}
					color={
						props.result.loser.position == 1
							? 'var(--yellow-primary-color)'
							: 'var(--blue-primary-color)'
					}
				/>
			</div>
		</div>
	);
}

export default GameResult;
