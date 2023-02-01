import RankingChooser from '../ranking/RankingChooser';
import '@/style/social/Social.css';
import { useState } from 'react';
import Ranking from '../ranking/Ranking';

export enum RankingType {
	GLOBAL = 'Global Ranking',
	FRIENDS = 'Friends Ranking',
}

const Social = () => {
	const [rankingType, setRankingType] = useState(RankingType.GLOBAL);
	return (
		<div className="ranking">
			<h1 className="ranking-title">Ranking</h1>
			<RankingChooser
				rankingType={rankingType}
				setRankingType={setRankingType}
			/>
			<Ranking rankingType={rankingType} />
		</div>
	);
};

export default Social;
