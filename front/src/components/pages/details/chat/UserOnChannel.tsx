import { useFormik } from 'formik';
import IUser from './IUser';
import '@/style/details/chat/UserOnChannel.css';
import StatusDot from '../social/StatusDot';
import { Link } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL, back_url } from '@/config.json';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { ChatContext } from '@/context/ChatContext';
import { InfoBoxContext, InfoType } from '@/context/InfoBoxContext';
import { UserRole } from './UserRole';
import { EUserStatus } from '../social/Types';

export default function UserOnChannel({
	selectedChannel,
	user,
	_userRole,
	_isMuted,
	myUserRole,
}: {
	selectedChannel: number;
	user: IUser;
	_userRole: UserRole;
	_isMuted: boolean;
	myUserRole: UserRole;
}) {
	const userContext = useContext(UserContext);
	const chatContext = useContext(ChatContext);
	const infoBoxContext = useContext(InfoBoxContext);
	const [userRole, setUserRole] = useState(_userRole);
	const [isMuted, setMuted] = useState(_isMuted);
	const [isPanelOpened, setPanelOpened] = useState(false);

	useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data) {
				return;
			}
			if (isStatusMessage(data)) {
				const jsonMessage = JSON.parse(data);
				if (user.id === jsonMessage.data.id)
					user.status = jsonMessage.data.status;
			}
			if (isChannelMessage(data)) {
				const parsedData = JSON.parse(data);
				const channel = parsedData.data.find((channel: any) => {
					return channel.id === selectedChannel;
				});
				setUserRole(
					getRole(
						user.id,
						channel?.adminsId || [],
						channel?.ownerId || -1,
					),
				);
				setMuted(
					channel.muted.some((muted: any) => {
						return muted.userId === user.id;
					}),
				);
			}
		},
	});

	const formik = useFormik({
		initialValues: { action: 'Ban', date: '' },
		onSubmit: async (props, { resetForm }) => {
			const accessToken: string = await userContext.getAccessToken();
			const endDate = new Date(props.date);
			if (endDate.getTime() < new Date().getTime()) {
				infoBoxContext.addInfo({
					type: InfoType.ERROR,
					message: 'Please use a date in the future!',
				});
				return;
			}
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
							end: endDate,
						}),
					}).then((res) => {
						if (!res.ok) {
							infoBoxContext.addInfo({
								type: InfoType.ERROR,
								message: "You can't do that !",
							});
						}
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
							end: endDate,
						}),
					}).then((res) => {
						if (!res.ok) {
							infoBoxContext.addInfo({
								type: InfoType.ERROR,
								message: "You can't do that !",
							});
						}
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
					}).then((res) => {
						if (!res.ok) {
							infoBoxContext.addInfo({
								type: InfoType.ERROR,
								message: "You can't do that !",
							});
						}
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
					}).then((res) => {
						if (!res.ok) {
							infoBoxContext.addInfo({
								type: InfoType.ERROR,
								message: "You can't do that !",
							});
						}
					});
					break;
				case 'Kick':
					fetch(back_url + '/chat/channel/kick', {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + accessToken,
						},
						body: JSON.stringify({
							channelId: selectedChannel,
							userId: user.id,
						}),
					}).then((res) => {
						if (!res.ok) {
							infoBoxContext.addInfo({
								type: InfoType.ERROR,
								message: "You can't do that !",
							});
						}
					});
					break;
			}
			setPanelOpened(false);
			resetForm();
		},
	});
	return (
		<li
			onClick={() => {
				if (
					myUserRole !== UserRole.USER &&
					user.id !== userContext.user.id &&
					userRole !== UserRole.OPERATOR &&
					!(
						userRole == UserRole.ADMIN &&
						myUserRole == UserRole.ADMIN
					)
				) {
					setPanelOpened(!isPanelOpened);
				}
			}}
		>
			<div
				className={
					'user-on-channel ' +
					((userRole === UserRole.OPERATOR && 'operator-border') ||
						(userRole === UserRole.ADMIN && 'admin-border') ||
						'')
				}
			>
				<img alt="profile picture" src={user.profile.picture} />
				<Link className="profile-link" to={`/profile/${user.name}`}>
					{user.name}
				</Link>
				<StatusDot
					status={(isMuted && EUserStatus.MUTED) || user.status}
				></StatusDot>
			</div>
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
						<option value="Kick">Kick</option>
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

	function getRole(
		id: number,
		adminsIds: number[],
		ownerId: number,
	): UserRole {
		if (id === ownerId) return UserRole.OPERATOR;
		else if (adminsIds.includes(id)) return UserRole.ADMIN;
		else return UserRole.USER;
	}

	function isStatusMessage(rawMessage: string) {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'user-status';
	}

	function isChannelMessage(rawMessage: string) {
		try {
			var message = JSON.parse(rawMessage);
		} catch (error) {
			return false;
		}
		return message?.['event'] == 'channels';
	}
}
