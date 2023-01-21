import ProfileSummaryItem from './ProfileSummaryItem';

function ProfileSummary(props: any) {
	return (
		<div className="profile-summary">
			<ProfileSummaryItem type="won" count={props.win} />
			<ProfileSummaryItem type="played" count={props.matches} />
			<ProfileSummaryItem type="lost" count={props.lost} />
		</div>
	);
}

export default ProfileSummary;
