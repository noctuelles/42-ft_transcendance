import '@/style/details/profile/ProfileHeader.css';
import { UserContext } from '@/context/UserContext';
import React from 'react';
import ProfileHeaderSearchBar from './ProfileHeaderSearchBar';

const ProfileHeader = (props: any) => {
	const userContext = React.useContext(UserContext);

	return (
		<div className="profile-header">
			<p>{props.username}</p>
			<ProfileHeaderSearchBar />
			<img src={userContext.user.profile_picture} />
		</div>
	);
};

export default ProfileHeader;
