import ProfileHeader from './details/profile/ProfileHeader';
import MatchHistoryTable from './details/profile/MatchHistoryTable';
import '@/style/Profile.css';
import React, { useContext, useEffect, useState } from 'react';
import Loader from '../global/Loader';
import ProfileSummary from './details/profile/ProfileSummary';
import { back_url } from '@/config.json';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import { ProfileData, ProfileMatchData } from './details/profile/ProfileTypes';
import AchievementTable from './details/profile/AchievementTable';
import { useNavigate, useParams } from 'react-router';
import { UserContext } from '@/context/UserContext';

const Profile = () => {
	const infoContext = React.useContext(InfoBoxContext);
	const navigate = useNavigate();
	const { username } = useParams();
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const userContext = useContext(UserContext);

	function handleSearch(searchValue: string) {
		if (profile?.name === searchValue || searchValue.length == 0) return;
		navigate(`/profile/${searchValue}`);
	}

	useEffect(() => {
		async function fetchData() {
			const token = await userContext.getAccessToken();
			fetch(back_url + `/users/profile/${username}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
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
					if (!profile) navigate('play');
					else {
						infoContext.addInfo({
							type: InfoType.ERROR,
							message: `Cannot find or load profile '${username}'`,
						});
					}
				});
		}
		fetchData();
	}, [navigate, username]);

	return !profile ? (
		<div className="profile-loading">
			<h2>Profile loading...</h2>
			<Loader color="black" />
		</div>
	) : (
		<div className="profile-container">
			<ProfileHeader
				username={profile.name}
				total_xp={profile.xp}
				picture={profile.picture}
				onSearchClick={handleSearch}
				status={profile.status}
				userId={profile.id}
				blocked={profile.blocked}
				blockedBy={profile.blockedBy}
			/>
			<hr />
			<div className="profile-top-summary">
				<MatchHistoryTable
					matches={profile.matches}
					name={profile.name}
				/>
				<ProfileSummary
					matches={profile.wonMatches + profile.lostMatches}
					win={profile.wonMatches}
					lost={profile.lostMatches}
					bounces={getTotalNbrBounces(profile.name, profile.matches)}
				/>
			</div>
			<AchievementTable profile={profile} />
		</div>
	);
};

function getTotalNbrBounces(
	username: string,
	matches: ProfileMatchData[],
): number {
	let totalNbrBounces = 0;

	matches.forEach((match: ProfileMatchData) => {
		match.userOne.user.name === username
			? (totalNbrBounces += match.userOne.bounces)
			: (totalNbrBounces += match.userTwo.bounces);
	});
	return totalNbrBounces;
}

export default Profile;
