import { IGamePlayer } from '../pages/Play';

interface IPreGameProps {
	players: IGamePlayer[];
}

function PreGame(props: IPreGameProps) {
	return (
		<div className="pre-game">
			<p>{props.players[0].infos.name}</p>
			<p>{props.players[1].infos.name}</p>
		</div>
	);
}

export default PreGame;
