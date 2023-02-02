import { Link } from 'react-router-dom';
import ProgressBar from '../global/ProgressBar';
import getLevelByXP from '../pages/details/profile/Utils';
import { IUserRanking } from './Ranking';

interface IRankingElementProps {
	user: IUserRanking;
	position: number;
}

function RankingElement(props: IRankingElementProps) {
	let [level, percentCompleted] = getLevelByXP(props.user.xp);

	return (
		<Link to={`/profile/${props.user.name}`}>
			<div className="ranking-element">
				<div className="ranking-left">
					<h3 className={`ranking-pos-${props.position}`}>
						{props.position}
					</h3>
					<img src={props.user.picture} alt="user" />
					{props.user.name}
				</div>
				<div className="ranking-right">
					<h3>ELO {props.user.elo}</h3>
					<div className="ranking-progress">
						<ProgressBar
							percent={percentCompleted}
							text={`Level ${level} - ${percentCompleted}%`}
						/>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default RankingElement;
