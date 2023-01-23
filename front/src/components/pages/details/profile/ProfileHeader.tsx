import '@/style/details/profile/ProfileHeader.css';
import { UserContext } from '@/context/UserContext';
import React from 'react';
import ProfileHeaderSearchBar from './ProfileHeaderSearchBar';

const ProfileHeader = (props: any) => {
	return (
		<div className="profile-header">
			<p>{props.username}</p>
			<ProfileHeaderSearchBar onSearchClick={props.onSearchClick} />
			<img src={props.picture} />
		</div>
	);
};

export default ProfileHeader;
