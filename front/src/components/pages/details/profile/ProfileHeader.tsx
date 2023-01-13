import '../../../../style/details/profile/ProfileHeader.css'

const ProfileHeader = (props: any) => {
	return (
		<div className="profile-header">
			<p>{props.username}</p>
			<img src="https://cdn.intra.42.fr/users/1022f4b45a249d0c6cea0572d68baab8/plouvel.jpg"/>
		</div>
	);
}

export default ProfileHeader;
