import '@/style/details/profile/MatchHistoryRow.css';
import Fight from '@/assets/fight.svg';
import FightFlipped from '@/assets/fight_flipped.svg';
import { ProfileMatchData } from './ProfileTypes';

interface MatchHistoryRowProps {
	match: ProfileMatchData;
}

const MatchHistoryRow = (props: MatchHistoryRowProps) => {
	let fightIcon = null;
	let diff =
		new Date(props.match.finishedAt).getTime() -
		new Date(props.match.createdAt).getTime();
	let timeInfo = {
		seconds: Math.floor((diff / 1000) % 60),
		minutes: Math.floor((diff / (1000 * 60)) % 60),
	};

	if (props.match.userOne !== props.match.looser) fightIcon = Fight;
	else fightIcon = FightFlipped;

	return (
		<div className="match-container">
			<h4>{`Duration - ${timeInfo.minutes}m${timeInfo.seconds}s`}</h4>
			<div className="match-summary">
				<img
					className="profile-pic"
					src={props.match.userOne.profile.picture}
				/>
				{props.match.userOne.name}
				<img id="fight" src={fightIcon} />
				{props.match.userTwo.name}
				<img
					className="profile-pic"
					src={props.match.userTwo.profile.picture}
				/>
			</div>
		</div>
	);
};

export default MatchHistoryRow;
