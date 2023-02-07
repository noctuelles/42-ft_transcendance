import '@/style/details/profile/ProfileHeader.css';
import ProfileHeaderSearchBar from './ProfileHeaderSearchBar';
import ProgressBar from '@/components/global/ProgressBar';
import getLevelByXP from './Utils';
import { UserStatus } from './ProfileTypes';
import { ws_url as WS_URL } from '@/config.json';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';

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
	const navigate = useNavigate();
	const infoBoxContext = useContext(InfoBoxContext);

	function isStatusChangedEvent(data: any): boolean {
		return data.event === 'user-status';
	}

	function isSpectateMatchEvent(data: any): boolean {
		return data.event === 'spectate-match';
	}

	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onMessage: (event) => {
			const data = JSON.parse(event.data);
			if (isStatusChangedEvent(data)) {
				if (data.data.id === props.userId) {
					setStatus(data.data.status);
				}
			} else if (isSpectateMatchEvent(data)) {
				if (data.data.status == 'error') {
					infoBoxContext.addInfo({
						type: InfoType.ERROR,
						message: data.data.error,
					});
				} else if (data.data.status == 'success') {
					navigate(`/play?spectate`);
				}
			}
		},
		filter: ({ data }) => {
			return (
				isStatusChangedEvent(JSON.parse(data)) ||
				isSpectateMatchEvent(JSON.parse(data))
			);
		},
	});

	useEffect(() => {
		setStatus(props.status);
	}, [props.status]);

	function spectateMatch() {
		sendMessage(
			JSON.stringify({
				event: 'spectate-match',
				data: {
					id: props.userId,
				},
			}),
		);
	}

	return (
		<div className="profile-header">
			<div className="profile-header-top">
				<div className="profile-header-user">
					{props.username}{' '}
					<div className={`profile-status status-${status}`}>
						{status}
					</div>
					{status == UserStatus.PLAYING && (
						<button
							className="profile-spectate-btn"
							onClick={spectateMatch}
						>
							Spectate
						</button>
					)}
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
