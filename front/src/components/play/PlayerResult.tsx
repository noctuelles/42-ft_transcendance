import '@/style/play/PlayerResult.css';

interface IPlayerResultProps {
	name: string;
	profile_picture: string;
	score: number;
	winner: boolean;
	color: string;
}

function PlayerResult(props: any) {
	return (
		<div className="player-result" style={{ backgroundColor: props.color }}>
			<div className="player-result-left">
				<img
					src={props.profile_picture}
					alt="profile picture"
					className="player-result-picture"
				/>
				<h3 className="player-result-name">{props.name}</h3>
			</div>
			<div className="player-result-right">
				<h3 className="player-result-score">{props.score}</h3>
			</div>
		</div>
	);
}

export default PlayerResult;
