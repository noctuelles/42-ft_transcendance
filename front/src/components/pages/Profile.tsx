import ProfileHeader from './details/profile/ProfileHeader';
import MatchHistoryTable from './details/profile/MatchHistoryTable';
import '@/style/Profile.css';
import { UserContext } from '@/context/UserContext';
import React from 'react';
import ProfileSummary from './details/profile/ProfileSummary';

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

const Profile = (props: any) => {
	const userContext = React.useContext(UserContext);

	return (
		<div className="container">
			<ProfileHeader username={userContext.user.name} />
			<hr />
			<MatchHistoryTable matches={Matches} />
			<ProfileSummary matches={15} win={12} />
		</div>
	);
};

export default Profile;
