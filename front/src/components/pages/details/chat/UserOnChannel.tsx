import IUser from './IUser';
import '@/style/details/chat/UserOnChannel.css';
import StatusDot from '../social/StatusDot';
import { EUserStatus } from '../social/Types';
import { Link } from 'react-router-dom';

export default function UserOnChannel({ user }: { user: IUser }) {
	return (
		<li className="user-on-channel">
			<img alt="profile picture" src={user.profile.picture} />
			<Link className="profile-link" to={`/profile/${user.name}`}>
				{user.name}
			</Link>
			<StatusDot status={user.status}></StatusDot>
		</li>
	);
}
