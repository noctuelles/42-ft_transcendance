import '@/style/details/profile/MatchHistoryRowDetails.css';
import { MatchType, UserMatchData } from './ProfileTypes';
import CheckMarkIcon from '@/assets/check-mark.svg';
import CrossIcon from '@/assets/cross.svg';
import FunMatchIcon from '@/assets/fun.svg';
import RankedMatchIcon from '@/assets/ranked.svg';
import getLevelByXP from './Utils';
import { formatXP } from './Utils';

interface MatchHistoryRowDetailsProps {
	userOne: UserMatchData;
	userTwo: UserMatchData;
	type: MatchType;
	date: Date;
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
	type,
	date,
}: MatchHistoryRowDetailsProps) {
	// any way to factorise that ?
	const userDetails: MatchDetails[] = [
		{
			id: 0,
			label: 'Level',
			userOneData: formatXP(...getLevelByXP(userOne.xpAtBeg)),
			userTwoData: formatXP(...getLevelByXP(userTwo.xpAtBeg)),
		},
		{
			id: 1,
			label: 'Score',
			userOneData: userOne.score,
			userTwoData: userTwo.score,
		},
		{
			id: 2,
			label: 'Winner',
			userOneData: userOne.winner ? (
				<img src={CheckMarkIcon} />
			) : (
				<img src={CrossIcon} />
			),
			userTwoData: userTwo.winner ? (
				<img src={CheckMarkIcon} />
			) : (
				<img src={CrossIcon} />
			),
		},
		{
			id: 3,
			label: 'XP',
			userOneData: `+${userOne.xpEarned}`,
			userTwoData: `+${userTwo.xpEarned}`,
		},
	];

	if (type === MatchType.RANKED)
		userDetails.push({
			id: 4,
			label: 'ELO',
			userOneData: `${userOne.eloEarned > 0 ? '+' : ''}${
				userOne.eloEarned
			}`,
			userTwoData: `${userTwo.eloEarned > 0 ? '+' : ''}${
				userTwo.eloEarned
			}`,
		});

	return (
		<div className="match-details">
			<img
				src={type === MatchType.RANKED ? RankedMatchIcon : FunMatchIcon}
				width={30}
				height={30}
				alt=""
			/>
			<h3>
				{`${type} - ${date.toLocaleString('default', {
					day: '2-digit',
					month: '2-digit',
					year: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
				})}`}
			</h3>
			<table>
				<thead></thead>
				<tbody>
					{userDetails.map((detail) => {
						return (
							<tr key={detail.id}>
								<td className="user-one-details">
									{detail.userOneData}
								</td>
								<td>{detail.label}</td>
								<td className="user-two-details">
									{detail.userTwoData}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
