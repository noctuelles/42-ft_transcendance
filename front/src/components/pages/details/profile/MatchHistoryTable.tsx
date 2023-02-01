import '@/style/details/profile/MatchHistoryTable.css';
import MatchHistoryRow from './MatchHistoryRow';
import { ProfileMatchData } from './ProfileTypes';

interface MatchHistoryTableProps {
	matches: ProfileMatchData[];
	name: string;
}

const MatchHistoryTable = (props: MatchHistoryTableProps) => {
	return (
		<div className="match-history-table">
			<h3>Matchs</h3>
			{!props.matches || props.matches.length == 0 ? (
				<span>
					You don't have any match yet. Don't delay, play today !
				</span>
			) : (
				<ul>
					{props.matches.map((m: ProfileMatchData) => (
						<li key={m.id}>
							<MatchHistoryRow match={m} />
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default MatchHistoryTable;
