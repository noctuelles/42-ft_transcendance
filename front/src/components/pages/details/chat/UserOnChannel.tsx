import IUser from './IUser';
import '@/style/details/chat/UserOnChannel.css';
import StatusDot from '../social/StatusDot';
import { EUserStatus } from '../social/Types';
import { Link } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL, back_url } from '@/config.json';

export default function UserOnChannel({ user }: { user: IUser }) {
	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data ?: string}) => {
			if (!data) {
				return ;
			}
			if (isStatusMessage(data)) {
				const jsonMessage = JSON.parse(data);
				if (user.id === jsonMessage.data.id)
					user.status = jsonMessage.data.status;
			}
		}
	}
	)
	return (
		<li className="user-on-channel">
			<img alt="profile picture" src={user.profile.picture} />
			<Link className="profile-link" to={`/profile/${user.name}`}>
				{user.name}
			</Link>
			<StatusDot status={user.status}></StatusDot>
		</li>
	);

	function isStatusMessage(rawMessage: string) {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'user-status';
	}
}
