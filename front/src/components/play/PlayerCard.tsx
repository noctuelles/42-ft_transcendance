import { IGamePlayer, IPlayerInfo } from '../pages/Play';
import '@/style/play/PlayerCard.css';

export enum PlayerPosition {
	LEFT = 'left',
	RIGHT = 'right',
}

export enum PlayerCardType {
	BEFORE_GAME = 'before-game',
	DURING_GAME = 'during-game',
}

interface IPlayerCardProps {
	player: IGamePlayer;
	position: PlayerPosition;
	type: PlayerCardType;
}

function PlayerCard(props: IPlayerCardProps) {
	return (
		<div
			className={`player-card card-${props.position} card-${props.type}`}
		>
			{props.type === PlayerCardType.BEFORE_GAME && (
				<div className="card-content">
					<img
						className="card-img"
						src={props.player.infos.profile_picture}
						alt="avatar"
					/>
					<h3 className="card-name">{props.player.infos.name}</h3>
				</div>
			)}
			{props.type === PlayerCardType.DURING_GAME && (
				<div className="card-content">
					<h3 className="card-name">{props.player.infos.name}</h3>
					<h3 className="card-score">{props.player.score}</h3>
				</div>
			)}
		</div>
	);
}

export default PlayerCard;
