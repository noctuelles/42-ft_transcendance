import { ChatContext } from '@/context/ChatContext';
import '@/style/details/chat/ChannelSideBar.css';
import { UserContext } from '@/context/UserContext';
import { useContext, useState, useEffect } from 'react';
import UserOnChannel from './UserOnChannel';
import IChannel from './IChannel';
import IUser from './IUser';
import { UserRole } from './UserRole';
import ChannelInvitation from './ChannelInvitation';
import ChannelInvitationForm from './ChannelInvitationForm';
import ChannelChangePwdForm from './ChannelChangePwdForm';
import IChannelInvitation from './IChannel';

export default function ChannelSideBar({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	const channel = getChannelInfo(selectedChannel);
	const userContext = useContext(UserContext);

	return (
		<>
			<h3>{channel?.name}</h3>
			<div className="channel-sidebar-top">
				{channel &&
					channel.type === 'PRIVATE' &&
					getRole(
						userContext.user.id,
						channel.adminsId,
						channel.ownerId,
					) !== UserRole.USER && (
						<ChannelInvitationForm channel={channel} />
					)}
				{channel &&
					channel.type === 'PWD_PROTECTED' &&
					getRole(
						userContext.user.id,
						channel.adminsId,
						channel.ownerId,
					) === UserRole.OPERATOR && (
						<ChannelChangePwdForm channel={channel} />
					)}
				<h3>{channel && 'User list'}</h3>
				<ul className="channel-sidebar-user">
					{channel?.members
						.sort((a: IUser, b: IUser) => {
							if (a.name.toLowerCase() < b.name.toLowerCase())
								return -1;
							if (a.name.toLowerCase() > b.name.toLowerCase())
								return 1;
							return 0;
						})
						.map((member: IUser) => {
							return (
								<UserOnChannel
									key={member.id}
									selectedChannel={selectedChannel}
									user={member}
									_userRole={getRole(
										member.id,
										channel.adminsId,
										channel.ownerId,
									)}
									_isMuted={channel.muted.some(
										(muted: any) => {
											return muted.userId === member.id;
										},
									)}
									myUserRole={getRole(
										userContext.user.id,
										channel.adminsId,
										channel.ownerId,
									)}
								/>
							);
						})}
				</ul>
			</div>
			{channel &&
				channel.type === 'PRIVATE' &&
				channel?.invitations.length > 0 &&
				getRole(
					userContext.user.id,
					channel.adminsId,
					channel.ownerId,
				) !== UserRole.USER && (
					<>
						<div className="channel-sidebar-break" />
						<h3>Invitations</h3>
						<ul className="channel-sidebar-user channel-invitation-list">
							{channel?.invitations
								.sort(
									(
										a: IChannelInvitation,
										b: IChannelInvitation,
									) => {
										if (
											a.username.toLowerCase() <
											b.username.toLowerCase()
										)
											return -1;
										if (
											a.username.toLowerCase() >
											b.username.toLowerCase()
										)
											return 1;
										return 0;
									},
								)
								.map((invit) => {
									return (
										<ChannelInvitation
											key={invit.userId}
											invitation={invit}
											channelId={channel.id}
										/>
									);
								})}
						</ul>
					</>
				)}
		</>
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
