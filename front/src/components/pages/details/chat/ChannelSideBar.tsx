import { ChatContext } from '@/context/ChatContext';
import '@/style/details/chat/ChannelSideBar.css';
import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';
import UserOnChannel from './UserOnChannel';
import IChannel from './IChannel';
import IUser from './IUser';
import { UserRole } from './UserRole';

export default function ChannelSideBar({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	const channel = getChannelInfo(selectedChannel);
	const userContext = useContext(UserContext);
	return (
		<div>
			<h3>{channel?.name}</h3>
			{channel?.members.map((member: IUser) => {
				return (
					<UserOnChannel
						key={member.name}
						selectedChannel={selectedChannel}
						user={member}
						userRole={getRole(
							member.id,
							channel.adminsId,
							channel.ownerId,
						)}
						myUserRole={getRole(
							userContext.user.id,
							channel.adminsId,
							channel.ownerId,
						)}
					/>
				);
			})}
		</div>
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

	function getChannelInfo(channelId: number): IChannel | undefined {
		const chatContext = useContext(ChatContext);
		const channel = chatContext.channels.find((channel) => {
			return channel.id == channelId;
		});
		return channel;
	}
}
