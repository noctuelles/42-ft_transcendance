export interface Match {
	id: number;
	playerOne: string;
	playerTwo: string;
	winner: string;
	duration: string;
	nbrOfBounce: number;
}

export interface MatchHistoryTableProps {
	matches: Match[];
	name: string;
}
