import { ChatContext } from '@/context/ChatContext';
import { useContext } from 'react';
import UserOnChannel from './UserOnChannel';
import IChannel from './IChannel';

export default function ChannelSideBar({
	selectedChannel,
}: {
	selectedChannel: number;
}) {
	return (
		<div>
			<h3>{selectedChannel}</h3>
			{getChannelInfo(selectedChannel)?.members.map((member: any) => {
				return <UserOnChannel user={member} />;
			})}
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
