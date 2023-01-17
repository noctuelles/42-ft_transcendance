import '@/style/details/profile/MatchHistoryTable.css';
import MatchHistoryRow from './MatchHistoryRow';

interface Match {
	playerOne: string;
	playerTwo: string;
	winner: string;
	duration: string;
	nbrOfBounce: number;
}

const MatchHistoryTable = (props: any) => {
	const rows: JSX.Element = [];

	props.matches.forEach((match: Match) => {
		rows.push(<MatchHistoryRow match={match} />);
	});

	return (
		<table>
			<thead>
				<p>Match History:</p>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
};

export default MatchHistoryTable;
