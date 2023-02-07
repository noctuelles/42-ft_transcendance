import '@/style/details/profile/ProfileHeader.css';
import ProfileHeaderSearchBar from './ProfileHeaderSearchBar';
import ProgressBar from '@/components/global/ProgressBar';
import getLevelByXP from './Utils';
import { UserStatus } from './ProfileTypes';
import { ws_url as WS_URL } from '@/config.json';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useState } from 'react';

interface ProfileHeaderProps {
	userId: number;
	onSearchClick: object;
	picture: string;
	status: UserStatus;
	total_xp: number;
	username: string;
}

const ProfileHeader = (props: ProfileHeaderProps) => {
	let [level, percentCompleted] = getLevelByXP(props.total_xp);
	const [status, setStatus] = useState(props.status);

	function isStatusChangedEvent(data: any): boolean {
		return data.event === 'user-status';
	}

	useWebSocket(WS_URL, {
		share: true,
		onMessage: (event) => {
			const data = JSON.parse(event.data);
			if (isStatusChangedEvent(data)) {
				if (data.data.id === props.userId) {
					setStatus(data.data.status);
				}
			}
		},
		filter: ({ data }) => {
			return isStatusChangedEvent(JSON.parse(data));
		},
	});

	return (
		<div className="profile-header">
			<div className="profile-header-top">
				<div className="profile-header-user">
					{props.username}{' '}
					<div className={`profile-status status-${status}`}>
						{status}
					</div>
				</div>
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
