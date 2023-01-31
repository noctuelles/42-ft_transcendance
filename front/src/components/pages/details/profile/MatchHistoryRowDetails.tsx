import ProgressBar from '@/components/global/ProgressBar';
import '@/style/details/profile/MatchHistoryRowDetails.css';
import { UserMatchData } from './ProfileTypes';
import CheckMark from '@/assets/check-mark.svg';
import Cross from '@/assets/cross.svg';

interface MatchHistoryRowDetailsProps {
	userOne: UserMatchData;
	userTwo: UserMatchData;
	looser: UserMatchData;
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
	looser,
}: MatchHistoryRowDetailsProps) {
	const userDetails: MatchDetails[] = [
		{
			id: 0,
			label: 'Score',
			userOneData: '1',
			userTwoData: '2',
		},
		{
			id: 1,
			label: 'Winner',
			userOneData:
				userOne.name !== looser?.name ? (
					<img src={CheckMark} />
				) : (
					<img src={Cross} />
				),
			userTwoData:
				userTwo.name !== looser?.name ? (
					<img src={CheckMark} />
				) : (
					<img src={Cross} />
				),
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
