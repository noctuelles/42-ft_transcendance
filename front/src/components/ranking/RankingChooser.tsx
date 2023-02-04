import '@/style/social/RankingChooser.css';
import { RankingType } from '../pages/Social';

interface IRankingChooserProps {
	rankingType: RankingType;
	setRankingType: (rankingType: RankingType) => void;
}

function RankingChooser(props: IRankingChooserProps) {
	return (
		<div className="ranking-chooser">
			<div
				className={`ranking-type ${
					props.rankingType == RankingType.GLOBAL && 'ranking-choosed'
				}`}
				onClick={() => props.setRankingType(RankingType.GLOBAL)}
			>
				{RankingType.GLOBAL}
			</div>
			<div
				className={`ranking-type ${
					props.rankingType == RankingType.FRIENDS &&
					'ranking-choosed'
				}`}
				onClick={() => props.setRankingType(RankingType.FRIENDS)}
			>
				{RankingType.FRIENDS}
			</div>
		</div>
	);
}

export default RankingChooser;
