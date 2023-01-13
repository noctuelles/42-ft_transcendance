import '../../../../style/details/profile/MatchHistoryRow.css'
import Fight from '../../../../assets/fight.svg'

const MatchHistoryRow = (props: any) => {
	return (
		<div className="match-container">
			<h4>{props.match.duration}</h4>
			<hr></hr>
			<div className="match-summary">
				<img className="profile-pic" src="we"/>
				{props.match.playerOne}
				<img id="fight" src={Fight}/>
				{props.match.playerTwo}
				<img className="profile-pic" src="https://cdn.intra.42.fr/users/1022f4b45a249d0c6cea0572d68baab8/plouvel.jpg"/>
			</div>
			<hr></hr>
		</div>
	);
}

export default MatchHistoryRow
