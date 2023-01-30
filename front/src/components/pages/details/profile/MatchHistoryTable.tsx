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
	return (
		<div className="match-history-table">
			<h3>Match history</h3>
			{!props.matches || props.matches.length == 0 ? (
				<span>You don't have any match yet</span>
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
