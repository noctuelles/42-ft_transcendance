import '@/style/details/profile/ProfileHeader.css';
import ProfileHeaderSearchBar from './ProfileHeaderSearchBar';
import ProgressBar from '@/components/global/ProgressBar';

const ProfileHeader = (props: any) => {
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

function getLevelByXP(xp: number): [number, number] {
	let logProgression = Math.log2(xp / 420 + 1);

	return [Math.floor(logProgression), Math.floor((logProgression % 1) * 100)];
}

export default ProfileHeader;
