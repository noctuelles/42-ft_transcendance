import { IPlayerInfo } from '../pages/Play';
import PlayerCard, { PlayerCardType, PlayerPosition } from './PlayerCard';
import '@/style/play/PreGame.css';

interface IPreGameProps {
	players: IPlayerInfo[];
}

function PreGame(props: IPreGameProps) {
	return (
		<div className="pre-game">
			<div className="pre-game-players">
				<PlayerCard
					player={props.players[0]}
					position={PlayerPosition.LEFT}
					type={PlayerCardType.BEFORE_GAME}
				/>
				<PlayerCard
					player={props.players[1]}
					position={PlayerPosition.RIGHT}
					type={PlayerCardType.BEFORE_GAME}
				/>
			</div>
		</div>
	);
}

export default PreGame;
