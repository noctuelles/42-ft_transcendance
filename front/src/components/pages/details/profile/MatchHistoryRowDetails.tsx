import '@/style/details/profile/MatchHistoryRowDetails.css';
import { UserMatchData } from './ProfileTypes';
import CheckMark from '@/assets/check-mark.svg';
import Cross from '@/assets/cross.svg';

interface MatchHistoryRowDetailsProps {
	userOne: UserMatchData;
	userTwo: UserMatchData;
}

interface MatchDetails {
	id: number;
	label: string;
	userOneData: any;
	userTwoData: any;
}

export function MatchHistoryRowDetails({
	userOne,
	userTwo,
}: MatchHistoryRowDetailsProps) {
	// any way to factorise that ?
	const userDetails: MatchDetails[] = [
		{
			id: 0,
			label: 'Score',
			userOneData: userOne.score,
			userTwoData: userTwo.score,
		},
		{
			id: 1,
			label: 'Winner',
			userOneData: userOne.winner ? (
				<img src={CheckMark} />
			) : (
				<img src={Cross} />
			),
			userTwoData: userTwo.winner ? (
				<img src={CheckMark} />
			) : (
				<img src={Cross} />
			),
		},
		{
			id: 2,
			label: 'XP',
			userOneData: `+${userOne.xpEarned}`,
			userTwoData: `+${userTwo.xpEarned}`,
		},
	];

	return (
		<div className="match-details">
			<table>
				<thead></thead>
				<colgroup span={3}></colgroup>
				<tbody>
					{userDetails.map((detail) => {
						return (
							<tr key={detail.id}>
								<td>{detail.userOneData}</td>
								<td>
									<u>{detail.label}</u>
								</td>
								<td>{detail.userTwoData}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
