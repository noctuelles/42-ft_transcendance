import '@/style/details/profile/MatchHistoryRow.css';
import Fight from '@/assets/fight.svg';
import FightFlipped from '@/assets/fight_flipped.svg';
import { ProfileMatchData } from './ProfileTypes';
import { CollapseArrow } from '@/components/global/CollapseArrow';
import { MatchHistoryRowDetails } from './MatchHistoryRowDetails';

interface MatchHistoryRowProps {
	match: ProfileMatchData;
}

const MatchHistoryRow = ({ match }: MatchHistoryRowProps) => {
	const diff =
		new Date(match.finishedAt).getTime() -
		new Date(match.createdAt).getTime();
	const timeInfo = {
		seconds: Math.floor((diff / 1000) % 60),
		minutes: Math.floor((diff / (1000 * 60)) % 60),
	};

	return (
		<div className="match-container">
			<h4>{`Match #${match.id} -  Duration : ${timeInfo.minutes}m${timeInfo.seconds}s`}</h4>
			<hr />
			<div className="match-summary">
				<img
					className="match-profile-pic"
					src={match.userOne.user.profile.picture}
				/>
				{match.userOne.user.name}
				<img
					id="fight"
					src={match.userOne.winner ? Fight : FightFlipped}
				/>
				{match.userTwo.user.name}
				<img
					className="match-profile-pic"
					src={match.userTwo.user.profile.picture}
				/>
			</div>
			<CollapseArrow>
				<hr />
				<MatchHistoryRowDetails
					userOne={match.userOne}
					userTwo={match.userTwo}
					type={match.type}
				/>
			</CollapseArrow>
		</div>
	);
};

export default MatchHistoryRow;
