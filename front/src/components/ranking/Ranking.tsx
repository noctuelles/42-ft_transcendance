import { RankingType } from '../pages/Social';
import RankingElement from './RankingElement';
import { useContext, useEffect, useRef, useState } from 'react';
import { back_url } from '@/config.json';
import Loader from '../global/Loader';
import { UserContext } from '@/context/UserContext';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import '@/style/social/Ranking.css';

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
	const infoBoxContext = useContext(InfoBoxContext);
	const [ranking, setRanking] = useState<IUserRanking[]>([]);
	const fetching = useRef(false);

	useEffect(() => {
		setRanking([]);
		async function fetchRanking() {
			const accessToken = await userContext.getAccessToken();
			fetch(
				`${back_url}/users/ranking${
					(props.rankingType == RankingType.FRIENDS && '/friends') ||
					(props.rankingType == RankingType.GLOBAL && '/global')
				}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'Content-Type': 'application/json',
					},
				},
			)
				.then((res) => {
					if (!res.ok) {
						throw new Error('Failed to fetch ranking');
					}
					return res.json();
				})
				.then((data) => {
					setRanking(data);
					fetching.current = false;
				})
				.catch((err) => {
					infoBoxContext.addInfo({
						type: InfoType.ERROR,
						message: err.message,
					});
				});
		}
		if (!fetching.current) {
			fetchRanking();
			fetching.current = true;
		}
	}, [props.rankingType]);

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
