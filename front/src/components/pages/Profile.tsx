import ProfileHeader from './details/profile/ProfileHeader';
import MatchHistoryTable from './details/profile/MatchHistoryTable';
import '@/style/Profile.css';
import { UserContext } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import ProfileSummary from './details/profile/ProfileSummary';
import { back_url } from '@/config.json';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

interface ProfileData {
	matches: object;
	achivements: object;
	matches_count: number;
	matches_won_count: number;
	matches_lost_count: number;
	name: string;
	picture: string;
}

const Profile = (props: any) => {
	const userContext = React.useContext(UserContext);
	const infoContext = React.useContext(InfoBoxContext);
	const [profile, setProfile] = useState<ProfileData | null>(null);

	function handleSearch(searchValue: string) {
		if (profile?.name === searchValue || searchValue.length == 0) return;
		fetch(back_url + `/users/profile/${searchValue}`)
			.then((response) => {
				if (response.ok) return response.json();
				return Promise.reject(response);
			})
			.then((data) => setProfile(data))
			.catch((response) => {
				console.log(response);
				infoContext.addInfo({
					type: InfoType.ERROR,
					message: `Cannot find or load profile '${searchValue}'`,
				});
			});
	}

	useEffect(() => {
		handleSearch(userContext.user.name);
	}, [userContext]);

	if (!profile) return <h2>Profile loading...</h2>;
	return (
		<div className="container">
			<ProfileHeader
				username={profile.name}
				picture={profile.picture}
				onSearchClick={handleSearch}
			/>
			<hr />
			<div className="profile-top-summary">
				<MatchHistoryTable matches={profile.matches} />
				<ProfileSummary
					matches={profile.matches_count}
					win={profile.matches_won_count}
					lost={profile.matches_lost_count}
				/>
			</div>
		</div>
	);
};

export default Profile;
