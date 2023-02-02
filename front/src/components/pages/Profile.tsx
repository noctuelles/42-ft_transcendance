import ProfileHeader from './details/profile/ProfileHeader';
import MatchHistoryTable from './details/profile/MatchHistoryTable';
import '@/style/Profile.css';
import { UserContext } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import Loader from '../global/Loader';
import ProfileSummary from './details/profile/ProfileSummary';
import { back_url } from '@/config.json';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import { ProfileData, ProfileMatchData } from './details/profile/ProfileTypes';
import AchievementTable from './details/profile/AchievementTable';
import { useNavigate, useParams } from 'react-router';

const Profile = () => {
	const infoContext = React.useContext(InfoBoxContext);
	const navigate = useNavigate();
	const { username } = useParams();
	const [profile, setProfile] = useState<ProfileData | null>(null);

	function handleSearch(searchValue: string) {
		if (profile?.name === searchValue || searchValue.length == 0) return;
		navigate(`/profile/${searchValue}`);
	}

	useEffect(() => {
		fetch(back_url + `/users/profile/${username}`)
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
					bounces={getTotalNbrBounces(profile.matches)}
				/>
			</div>
			<AchievementTable profile={profile} />
		</div>
	);
};

function getTotalNbrBounces(matches: ProfileMatchData[]): number {
	let totalNbrBounces = 0;

	matches?.forEach(
		(match: ProfileMatchData) =>
			match.userOne.bounce + match.userTwo.bounce,
	);
	return totalNbrBounces;
}

export default Profile;
