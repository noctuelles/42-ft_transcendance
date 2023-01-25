import ProfileSummaryItem from './ProfileSummaryItem';
import '@/style/details/profile/ProfileSummary.css';

interface ProfileSummaryProps {
	matches: number;
	win: number;
	lost: number;
	bounces: number;
}

function ProfileSummary(props: ProfileSummaryProps) {
	return (
		<div className="profile-summary">
			<ProfileSummaryItem type="played" count={props.matches} />
			<ProfileSummaryItem type="won" count={props.win} />
			<ProfileSummaryItem type="lost" count={props.lost} />
			<ProfileSummaryItem type="bounce" count={props.bounces} />
		</div>
	);
}

export default ProfileSummary;
