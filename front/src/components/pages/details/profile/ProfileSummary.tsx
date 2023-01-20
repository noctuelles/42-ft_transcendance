import ProfileSummaryItem from './ProfileSummaryItem';

function ProfileSummary(props: any) {
	return (
		<div className="profile-summary">
			<ProfileSummaryItem type="match_won" />
			<ProfileSummaryItem type="match_played" />
			<ProfileSummaryItem type="match_lost" />
			<p>blabla</p>
		</div>
	);
}

export default ProfileSummary;
