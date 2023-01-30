import ProgressBar from '@/components/global/ProgressBar';
import '@/style/details/profile/MatchHistoryRowDetails.css';
import { UserMatchData } from './ProfileTypes';

interface SideDetailsProps {
	side: string;
	player: UserMatchData;
}

function SideDetails({ side }: SideDetailsProps) {
	return (
		<div className={`match-details-${side}`}>
			<p>blalba</p>
		</div>
	);
}

interface MatchHistoryRowDetailsProps {
	userOne: UserMatchData;
	userTwo: UserMatchData;
}

export function MatchHistoryRowDetails({
	userOne,
	userTwo,
}: MatchHistoryRowDetailsProps) {
	return (
		<div className="match-details">
			<table>
				<colgroup span={3}></colgroup>
				<tr>
					<td>{userOne.profile.xp}</td>
					<td>
						<u>Level</u>
					</td>
					<td>{userTwo.profile.xp}</td>
				</tr>
				<tr>
					<td>
						<ProgressBar percent={10} />
					</td>
					<td>Level</td>
					<td>{userTwo.profile.xp}</td>
				</tr>
			</table>
		</div>
	);
}
