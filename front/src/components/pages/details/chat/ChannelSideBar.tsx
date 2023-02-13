import { ChatContext } from '@/context/ChatContext';
import '@/style/details/chat/ChannelSideBar.css';
import { useContext } from 'react';
import UserOnChannel from './UserOnChannel';
import IChannel from './IChannel';
import IUser from './IUser';

export default function ChannelSideBar({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	return (
		<div>
			<h3>{selectedChannel}</h3>
			<ul className="channel-sidebar-user">
				{getChannelInfo(selectedChannel)?.members.map(
					(member: IUser) => {
						return <UserOnChannel key={member.id} user={member} />;
					},
				)}
			</ul>
		</div>
	);

	function getChannelInfo(channelId: number): IChannel | undefined {
		const chatContext = useContext(ChatContext);
		const channel = chatContext.channels.find((channel) => {
			return channel.id == channelId;
		});
		return channel;
	}
}
