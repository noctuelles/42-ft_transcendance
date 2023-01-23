import { useRef, useState } from 'react';

const ProfileHeaderSearchBar = (props: any) => {
	const searchInput = useRef<HTMLInputElement>(null);
	const [isBtnCliked, setIsBtnClicked] = useState(false);

	function handleSearchButtonClick() {
		if (!isBtnCliked) {
			props.onSearchClick(searchInput.current?.value);
			setIsBtnClicked(true);
			setTimeout(() => setIsBtnClicked(false), 3000);
		}
	}

	return (
		<div className="profile-header-searchbar">
			<input
				type="search"
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
