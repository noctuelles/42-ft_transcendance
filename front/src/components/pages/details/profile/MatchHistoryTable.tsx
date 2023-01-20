import '@/style/details/profile/MatchHistoryTable.css';
import MatchHistoryRow from './MatchHistoryRow';

interface Match {
	id: number;
	playerOne: string;
	playerTwo: string;
	winner: string;
	duration: string;
	nbrOfBounce: number;
}

const MatchHistoryTable = (props: any) => {
	return (
		<table>
			<thead>
				<p>Match History:</p>
			</thead>
			<tbody>
				{props.matches.map((m: Match) => (
					<MatchHistoryRow key={m.id} match={m} />
				))}
			</tbody>
		</table>
	);
};

export default MatchHistoryTable;
