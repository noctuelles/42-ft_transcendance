import { RankingType } from '../pages/Social';
import '@/style/social/Ranking.css';
import RankingElement from './RankingElement';
import { useContext, useEffect, useState } from 'react';
import { back_url } from '@/config.json';
import Loader from '../global/Loader';
import { UserContext } from '@/context/UserContext';

interface IRankingProps {
	rankingType: RankingType;
}

export interface IUserRanking {
	id: number;
	name: string;
	picture: string;
	elo: number;
	xp: number;
}

function Ranking(props: IRankingProps) {
	const userContext = useContext(UserContext);
	const [ranking, setRanking] = useState<IUserRanking[]>([]);

	useEffect(() => {
		async function fetchApi() {
			const accessToken = await userContext.getAccessToken();
			fetch(`${back_url}/users/ranking`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			})
				.then((res) => res.json())
				.then((data) => {
					setRanking(data);
				});
		}
		fetchApi();
	}, []);

	return (
		<div className="ranking-content">
			<h2>{props.rankingType}</h2>
			<div
				className={`${
					ranking.length > 0 ? 'ranking-users' : 'ranking-loading'
				}`}
			>
				{ranking.length > 0 ? (
					ranking.map((user, index) => {
						return (
							<RankingElement
								key={user.id}
								user={user}
								position={index + 1}
							/>
						);
					})
				) : (
					<Loader color="black" />
				)}
			</div>
		</div>
	);
}

export default Ranking;
