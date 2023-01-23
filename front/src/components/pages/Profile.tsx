import ProfileHeader from './details/profile/ProfileHeader';
import MatchHistoryTable from './details/profile/MatchHistoryTable';
import '@/style/Profile.css';
import { UserContext } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import ProfileSummary from './details/profile/ProfileSummary';
import { back_url } from '@/config.json';

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
	const [profile, setProfile] = useState<ProfileData | null>(null);

	function handleSearch(searchValue: string) {
		fetch(back_url + `/users/profile/${searchValue}`)
			.then((response) => {
				if (response.ok) return response.json();
				return Promise.reject(response);
			})
			.then((data) => setProfile(data))
			.catch((response) => {
				console.log(response);
				/* TODO */
			});
	}

	useEffect(() => {
		fetch(back_url + `/users/profile/${userContext.user.name}`)
			.then((response) => {
				return response.json();
			})
			.then((data) => setProfile(data));
		//TODO: catch
	}, [userContext]);

	if (!profile) return <p>Profile loading...</p>;
	return (
		<div className="container">
			<ProfileHeader
				username={profile.name}
				picture={profile.picture}
				onSearchClick={handleSearch}
			/>
			<hr />
			<MatchHistoryTable matches={profile.matches} />
			<ProfileSummary
				matches={profile.matches_count}
				win={profile.matches_won_count}
				lost={profile.matches_lost_count}
			/>
		</div>
	);
};

export default Profile;
