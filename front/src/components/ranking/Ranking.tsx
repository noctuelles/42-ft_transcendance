import { RankingType } from '../pages/Social';
import '@/style/social/Ranking.css';
import RankingElement from './RankingElement';

interface IRankingProps {
	rankingType: RankingType;
}

function Ranking(props: IRankingProps) {
	const ranking = [
		{
			id: 1,
			name: 'dhubleur',
			picture: 'http://localhost:3000/cdn/user/dhubleur.jpg',
			elo: 1500,
			xp: 100,
		},
		{
			id: 2,
			name: 'dhubleur',
			picture: 'http://localhost:3000/cdn/user/dhubleur.jpg',
			elo: 1400,
			xp: 100,
		},
		{
			id: 3,
			name: 'dhubleur',
			picture: 'http://localhost:3000/cdn/user/dhubleur.jpg',
			elo: 1200,
			xp: 100,
		},
	];

	return (
		<div className="ranking-content">
			<h2>{props.rankingType}</h2>
			<div className="ranking-users">
				{ranking.map((user, index) => {
					return (
						<RankingElement
							key={user.id}
							user={user}
							position={index + 1}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default Ranking;
