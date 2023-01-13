import React from 'react'
import '../../../../style/details/profile/MatchHistoryRow.css'
import Fight from '../../../../assets/fight.svg'
import FightFlipped from '../../../../assets/fight_flipped.svg'

const MatchHistoryRow = (props: any) => {
	let fightIcon = null;

	if (props.match.playerOne === props.match.winner)
		fightIcon = Fight;
	else
		fightIcon = FightFlipped;

	return (
		<div className="match-container">
			<h4>Duration - {props.match.duration}</h4>
			<hr></hr>
			<div className="match-summary">
				<img className="profile-pic" src="https://cdn.intra.42.fr/users/96f4621e2d6017c093b97002c72ffbd9/dhubleur.jpg"/>
				{props.match.playerOne}
				<img id="fight" src={fightIcon}/>
				{props.match.playerTwo}
				<img className="profile-pic" src="https://cdn.intra.42.fr/users/1022f4b45a249d0c6cea0572d68baab8/plouvel.jpg"/>
			</div>
			<hr></hr>
		</div>
	);
}

export default MatchHistoryRow
