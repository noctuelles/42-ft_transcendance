import '@/style/details/profile/MatchHistoryRow.css';
import Fight from '@/assets/fight.svg';
import FightFlipped from '@/assets/fight_flipped.svg';
import { ProfileMatchData } from './ProfileTypes';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { CollapseArrow } from '@/components/global/CollapseArrow';
import { MatchHistoryRowDetails } from './MatchHistoryRowDetails';

interface MatchHistoryRowProps {
	match: ProfileMatchData;
}

const MatchHistoryRow = (props: MatchHistoryRowProps) => {
	const userContext = useContext(UserContext);

	let fightIcon = null;
	let diff =
		new Date(props.match.finishedAt).getTime() -
		new Date(props.match.createdAt).getTime();
	let timeInfo = {
		seconds: Math.floor((diff / 1000) % 60),
		minutes: Math.floor((diff / (1000 * 60)) % 60),
	};

	if (!props.match.looser) {
		if (props.match.userOne.name === userContext.user.name)
			fightIcon = FightFlipped;
		else fightIcon = Fight;
	} else {
		if (props.match.userOne.name === userContext.user.name)
			fightIcon = Fight;
		else fightIcon = FightFlipped;
	}

	return (
		<div className="match-container">
			<h4>{`Match #${props.match.id} -  Duration : ${timeInfo.minutes}m${timeInfo.seconds}s`}</h4>
			<hr />
			<div className="match-summary">
				<img
					className="match-profile-pic"
					src={props.match.userOne.profile.picture}
				/>
				{props.match.userOne.name}
				<img id="fight" src={fightIcon} />
				{props.match.userTwo.name}
				<img
					className="match-profile-pic"
					src={props.match.userTwo.profile.picture}
				/>
			</div>
			<CollapseArrow>
				<hr />
				<MatchHistoryRowDetails />
			</CollapseArrow>
		</div>
	);
};

export default MatchHistoryRow;
