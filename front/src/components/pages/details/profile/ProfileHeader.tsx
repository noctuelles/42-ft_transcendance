import '@/style/details/profile/ProfileHeader.css';
import ProfileHeaderSearchBar from './ProfileHeaderSearchBar';
import ProgressBar from '@/components/global/ProgressBar';
import getLevelByXP from './Utils';

interface ProfileHeaderProps {
	onSearchClick: object;
	picture: string;
	total_xp: number;
	username: string;
}

const ProfileHeader = (props: ProfileHeaderProps) => {
	let [level, percentCompleted] = getLevelByXP(props.total_xp);

	return (
		<div className="profile-header">
			<div className="profile-header-top">
				<p>{props.username}</p>
				<ProfileHeaderSearchBar onSearchClick={props.onSearchClick} />
				<img src={props.picture} />
			</div>

			<div className="profile-header-bottom">
				<ProgressBar
					percent={percentCompleted}
					text={`Level ${level} - ${percentCompleted}%`}
				/>
			</div>
		</div>
	);
};

export default ProfileHeader;
