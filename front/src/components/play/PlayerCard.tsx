import { IPlayerInfo } from '../pages/Play';
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
	player: IPlayerInfo;
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
						src={props.player.profile_picture}
						alt="avatar"
					/>
					<h3 className="card-name">{props.player.name}</h3>
				</div>
			)}
		</div>
	);
}

export default PlayerCard;
