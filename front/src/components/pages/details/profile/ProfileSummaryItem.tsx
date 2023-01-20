function ProfileSummaryItem(props: any) {
	const item = new Map([
		['match_won', 'ipsum'],
		['match_played', 'ipsum'],
		['match_lost', 'ipsum'],
	]);

	return (
		<div className="profile-summary">
			<img src={item.get(props.type)} />
			<p>blabla</p>
		</div>
	);
}

export default ProfileSummaryItem;
