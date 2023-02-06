import { UserContext } from '@/context/UserContext';
import '@/style/details/profile/MatchHistoryTable.css';
import { useContext } from 'react';
import MatchHistoryRow from './MatchHistoryRow';
import { ProfileMatchData } from './ProfileTypes';

interface MatchHistoryTableProps {
	matches: ProfileMatchData[];
	name: string;
}

const MatchHistoryTable = (props: MatchHistoryTableProps) => {
	const userContext = useContext(UserContext);

	return (
		<div className="match-history-table">
			<h3>Matchs</h3>
			{!props.matches || props.matches.length == 0 ? (
				<span>
					{props.name === userContext.user.name ? 'You' : props.name}{' '}
					don't have any match yet. Don't delay,{' '}
					{props.name === userContext.user.name ? 'play' : 'invite'}{' '}
					today !
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
