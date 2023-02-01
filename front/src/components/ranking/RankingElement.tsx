interface IRankingElementProps {
	user: {
		id: number;
		name: string;
		picture: string;
		elo: number;
		xp: number;
	};
	position: number;
}

function RankingElement(props: IRankingElementProps) {
	return (
		<div className="ranking-element">
			{props.position}
			{props.user.name}
		</div>
	);
}

export default RankingElement;
