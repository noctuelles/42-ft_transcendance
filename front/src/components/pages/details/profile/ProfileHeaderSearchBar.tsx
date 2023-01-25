import { useRef, useState } from 'react';
import Button from '@/components/global/Button';

//TODO: interface here, but this is subject to changes.

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
			<Button
				type="submit"
				onBtnClick={handleSearchButtonClick}
				children="Search"
			/>
		</div>
	);
};

export default ProfileHeaderSearchBar;
