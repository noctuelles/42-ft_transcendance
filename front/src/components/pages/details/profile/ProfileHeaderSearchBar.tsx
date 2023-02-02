import { useRef, useState } from 'react';
import Button from '@/components/global/Button';

//TODO: interface here, but this is subject to changes.

const ProfileHeaderSearchBar = (props: any) => {
	const searchInput = useRef<HTMLInputElement>(null);
	const [isBtnCliked, setIsBtnClicked] = useState(false);

	function handleSubmit(e: React.ChangeEvent<HTMLButtonElement>) {
		e.preventDefault();

		if (!isBtnCliked) {
			props.onSearchClick(searchInput.current?.value);
			setIsBtnClicked(true);
			setTimeout(() => setIsBtnClicked(false), 3000);
		}
	}

	return (
		<form>
			<input
				type="search"
				ref={searchInput}
				placeholder="Search for a profile..."
			/>
			<Button type="submit" onClick={handleSubmit}>
				Search
			</Button>
		</form>
	);
};

export default ProfileHeaderSearchBar;
