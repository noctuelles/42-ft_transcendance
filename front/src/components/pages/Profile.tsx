import ProfileHeader from './details/profile/ProfileHeader';
import MatchHistoryTable from './details/profile/MatchHistoryTable';
import '@/style/Profile.css';
import { UserContext } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import ProfileSummary from './details/profile/ProfileSummary';
import { back_url } from '@/config.json';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import { ProfileData, ProfileMatchData } from './details/profile/ProfileTypes';
import AchievementItem from './details/profile/AchievementItem';

const Profile = () => {
	const userContext = React.useContext(UserContext);
	const infoContext = React.useContext(InfoBoxContext);
	const [profile, setProfile] = useState<ProfileData | null>(null);

	function handleSearch(searchValue: string) {
		if (profile?.name === searchValue || searchValue.length == 0) return;
		fetch(back_url + `/users/profile/${searchValue}`)
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((data: ProfileData) => {
				setProfile(data);
			})
			.catch(() => {
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
		<div className="profile-container">
			<ProfileHeader
				username={profile.name}
				total_xp={profile.xp}
				picture={profile.picture}
				onSearchClick={handleSearch}
			/>
			<hr />
			<div className="profile-top-summary">
				<MatchHistoryTable
					matches={profile.matches}
					name={profile.name}
				/>
				<ProfileSummary
					matches={profile.matchesCount}
					win={profile.matchesWonCount}
					lost={profile.matchesLostCount}
					bounces={getTotalNbrBounces(profile.matches)}
				/>
			</div>
			<AchievementItem
				achievement={{
					img: 'blabla',
					title: 'Butcher',
					description: 'Lojrtioje.',
				}}
				unlocked={true}
				unlockedDate={new Date('2023-01-26T14:05:13.728Z')}
			/>
		</div>
	);
};

function getTotalNbrBounces(matches: ProfileMatchData[]): number {
	let totalNbrBounces = 0;

	matches.forEach(
		(match: ProfileMatchData) => (totalNbrBounces += match.bounces),
	);
	return totalNbrBounces;
}

export default Profile;
