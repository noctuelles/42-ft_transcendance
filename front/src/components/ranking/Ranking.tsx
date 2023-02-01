import { RankingType } from '../pages/Social';
import '@/style/social/Ranking.css';

interface IRankingProps {
	rankingType: RankingType;
}

function Ranking(props: IRankingProps) {
	return (
		<div className="ranking-content">
			<h2>{props.rankingType}</h2>
		</div>
	);
}

export default Ranking;
