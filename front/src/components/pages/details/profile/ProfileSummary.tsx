import ProfileSummaryItem from './ProfileSummaryItem';
import '@/style/details/profile/ProfileSummary.css';

function ProfileSummary(props: any) {
	return (
		<div className="profile-summary">
			<ProfileSummaryItem type="played" count={props.matches} />
			<ProfileSummaryItem type="won" count={props.win} />
			<ProfileSummaryItem type="lost" count={props.lost} />
		</div>
	);
}

export default ProfileSummary;
