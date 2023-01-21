import ProfileHeader from './details/profile/ProfileHeader';
import MatchHistoryTable from './details/profile/MatchHistoryTable';
import '@/style/Profile.css';
import { UserContext } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import ProfileSummary from './details/profile/ProfileSummary';
import { back_url } from '@/config.json';

const Matches = [
	{
		id: 0,
		playerOne: 'dhubleur',
		playerTwo: 'plouvel',
		winner: 'plouvel',
		duration: '4:32',
		nbrOfBounce: 423,
	},
	{
		id: 1,
		playerOne: 'jmaia',
		playerTwo: 'bsavinel',
		winner: 'jmaia',
		duration: '3:12',
		nbrOfBounce: 301,
	},
	{
		id: 2,
		playerOne: 'jmaia',
		playerTwo: 'plouvel',
		winner: 'jmaia',
		duration: '6:73',
		nbrOfBounce: 859,
	},
];

interface ProfileData {
	matches: object;
	achivements: object;
	matches_count: number;
	matches_won_count: number;
	matches_lost_count: number;
}

const Profile = (props: any) => {
	const userContext = React.useContext(UserContext);
	const [profile, setProfile] = useState<ProfileData | null>(null);

	useEffect(() => {
		fetch(back_url + `/users/profile/${userContext.user.name}`)
			.then((response) => response.json())
			.then((data) => setProfile(data));
	}, []);

	if (!profile) return <p>Profile loading...</p>;
	console.log(profile);
	return (
		<div className="container">
			<ProfileHeader username={userContext.user.name} />
			<hr />
			<MatchHistoryTable matches={Matches} />
			<ProfileSummary
				matches={profile.matches_count}
				win={profile.matches_won_count}
				lost={profile.matches_lost_count}
			/>
		</div>
	);
};

export default Profile;
