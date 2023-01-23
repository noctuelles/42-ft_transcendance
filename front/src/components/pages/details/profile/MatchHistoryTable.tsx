import '@/style/details/profile/MatchHistoryTable.css';
import MatchHistoryRow from './MatchHistoryRow';
import Match from '@/types';

const MatchHistoryTable = (props: any) => {
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
							You haven't played any match yet. Don't delay, play
							today.
						</td>
					</tr>
				</tbody>
			) : (
				<tbody>
					{props.matches.map((m: Match) => (
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
