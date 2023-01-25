import '@/style/details/profile/MatchHistoryTable.css';
import MatchHistoryRow from './MatchHistoryRow';
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { ProfileMatchData } from './ProfileTypes';

interface MatchHistoryTableProps {
	matches: ProfileMatchData[];
	name: string;
}

const MatchHistoryTable = (props: MatchHistoryTableProps) => {
	const userContext = useContext(UserContext);

	return (
		<table>
			<thead>
				<tr>
					<th scope="col">Match history:</th>
				</tr>
			</thead>
			{!props.matches || props.matches.length == 0 ? (
				<tbody>
					<tr>
						<td>
							{props.name == userContext.user.name
								? 'You '
								: `${props.name} `}
							haven't played any match...
						</td>
					</tr>
				</tbody>
			) : (
				<tbody>
					{props.matches.map((m: ProfileMatchData) => (
						<tr>
							<td>
								<MatchHistoryRow key={m.id} match={m} />
							</td>
						</tr>
					))}
				</tbody>
			)}
		</table>
	);
};

export default MatchHistoryTable;
