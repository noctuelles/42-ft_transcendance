import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import getLevelByXP from '../pages/details/profile/Utils';
import { IUserRanking } from './Ranking';

interface IRankingElementProps {
	user: IUserRanking;
	position: number;
}

function RankingElement(props: IRankingElementProps) {
	let [level, percentCompleted] = getLevelByXP(props.user.xp);
	const userContext = useContext(UserContext);

	return (
		<Link to={`/profile/${props.user.name}`}>
			<div
				className={`ranking-element ranking-${
					userContext.user.name === props.user.name ? 'me' : 'other'
				}`}
			>
				<div className="ranking-left">
					<h3 className={`ranking-pos-${props.position}`}>
						{props.position}
					</h3>
					<img src={props.user.picture} alt="user" />
					{props.user.name}
				</div>
				<div className="ranking-right">
					<h3 className="ranking-elo">ELO {props.user.elo}</h3>
					<div className="spacer"></div>
					<h3 className="ranking-xp">Level {level}</h3>
				</div>
			</div>
		</Link>
	);
}

export default RankingElement;
