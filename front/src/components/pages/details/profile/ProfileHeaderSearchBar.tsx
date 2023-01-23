import { useRef, useState } from 'react';

const ProfileHeaderSearchBar = (props: any) => {
	const searchInput = useRef(null);

	function handleSearchButtonClick() {
		props.onSearchClick(searchInput.current.value);
	}

	return (
		<div className="profile-header-searchbar">
			<input
				type="search"
				name=""
				ref={searchInput}
				placeholder="Search for a profile..."
			/>
			<button type="submit" onClick={handleSearchButtonClick}>
				Search
			</button>
		</div>
	);
};

export default ProfileHeaderSearchBar;
