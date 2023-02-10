import { useFormik } from 'formik';
import IUser from './IUser';
import '@/style/details/chat/UserOnChannel.css';
import StatusDot from '../social/StatusDot';
import { EUserStatus } from '../social/Types';
import { Link } from 'react-router-dom';
import { back_url } from '@/config.json';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { UserRole } from './UserRole';

export default function UserOnChannel({
	selectedChannel,
	user,
	userRole,
	myUserRole,
}: {
	selectedChannel: number;
	user: IUser;
	userRole: UserRole;
	myUserRole: UserRole;
}) {
	const userContext = useContext(UserContext);
	const [isPanelOpened, setPanelOpened] = useState(false);
	const formik = useFormik({
		initialValues: { action: 'Ban', date: '' },
		onSubmit: async (props, { resetForm }) => {
			const accessToken: string = await userContext.getAccessToken();
			switch (props.action) {
				case 'Ban':
					fetch(back_url + '/chat/channel/ban', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + accessToken,
						},
						body: JSON.stringify({
							channelId: selectedChannel,
							userId: user.id,
							end: props.date,
						}),
					});
					break;
				case 'Mute':
					fetch(back_url + '/chat/channel/mute', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + accessToken,
						},
						body: JSON.stringify({
							channelId: selectedChannel,
							userId: user.id,
							end: props.date,
						}),
					});
					break;
				case 'Promote':
					fetch(back_url + '/chat/channel/promote', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + accessToken,
						},
						body: JSON.stringify({
							channelId: selectedChannel,
							userId: user.id,
						}),
					});
					break;
				case 'Unpromote':
					fetch(back_url + '/chat/channel/unpromote', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + accessToken,
						},
						body: JSON.stringify({
							channelId: selectedChannel,
							userId: user.id,
						}),
					});
					break;
			}
			resetForm();
		},
	});
	return (
		<li className="user-on-channel"
			onClick={() => {
				if (
					myUserRole !== UserRole.USER &&
					user.id !== userContext.user.id
				)
					setPanelOpened(!isPanelOpened);
			}}
		>
			<img alt="profile picture" src={user.profile.picture} />
			<Link className="profile-link" to={`/profile/${user.name}`}>
				{user.name}
			</Link>
			<StatusDot status={user.status}></StatusDot>
			{isPanelOpened && (
				<form
					onSubmit={formik.handleSubmit}
					onClick={(event) => {
						event.stopPropagation();
					}}
				>
					<select
						name="action"
						onChange={formik.handleChange}
						value={formik.values.action}
					>
						<option value="Ban">Ban</option>
						<option value="Mute">Mute</option>
						{myUserRole === UserRole.OPERATOR &&
						userRole === UserRole.USER ? (
							<option value="Promote">Promote</option>
						) : (
							<option value="Unpromote">Unpromote</option>
						)}
					</select>
					{(formik.values.action === 'Ban' ||
						formik.values.action === 'Mute') && (
						<input
							name="date"
							type="datetime-local"
							onChange={formik.handleChange}
							value={formik.values.date}
							required
						/>
					)}
					<input type="submit" value="Submit" />
				</form>
			)}
		</li>
	);
}
