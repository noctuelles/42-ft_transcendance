import ProfileHeader from './details/profile/ProfileHeader';
import MatchHistoryTable from './details/profile/MatchHistoryTable';
import '@/style/Profile.css';
import { UserContext } from '@/context/UserContext';
import React from 'react';
import ProfileSummary from './details/profile/ProfileSummary';

const Matches = [
	{
		playerOne: 'dhubleur',
		playerTwo: 'plouvel',
		winner: 'plouvel',
		duration: '4:32',
		nbrOfBounce: 423,
	},
	{
		playerOne: 'jmaia',
		playerTwo: 'bsavinel',
		winner: 'jmaia',
		duration: '3:12',
		nbrOfBounce: 301,
	},
	{
		playerOne: 'jmaia',
		playerTwo: 'plouvel',
		winner: 'jmaia',
		duration: '6:73',
		nbrOfBounce: 859,
	},
];

const Profile = (props: any) => {
	const userContext = React.useContext(UserContext);

	return (
		<div className="container">
			<ProfileHeader username={userContext.user.name} />
			<hr />
			<MatchHistoryTable matches={Matches} />
			<ProfileSummary win={12} />
		</div>
	);
};

export default Profile;
