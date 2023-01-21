import '@/style/details/profile/MatchHistoryTable.css';
import MatchHistoryRow from './MatchHistoryRow';
import Match from '@/types';

const MatchHistoryTable = (props: any) => {
	return (
		<table>
			<thead>
				<p>Match History:</p>
			</thead>
			{!props.matches ? (
				<p>You haven't played any match yet.</p>
			) : (
				<tbody>
					{props.matches.map((m: Match) => (
						<MatchHistoryRow key={m.id} match={m} />
					))}
				</tbody>
			)}
		</table>
	);
};

export default MatchHistoryTable;
