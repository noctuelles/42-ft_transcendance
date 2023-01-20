const ProfileHeaderSearchBar = (props: any) => {
	return (
		<div className="profile-header-searchbar">
			<input
				type="search"
				name=""
				placeholder="Search for a profile..."
			/>
			<button type="submit">Search</button>
		</div>
	);
};

export default ProfileHeaderSearchBar;
