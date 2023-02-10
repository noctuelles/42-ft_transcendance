import { useEffect, useContext } from 'react';
import '@/style/details/chat/ChannelList.css';
import Channel from './Channel';
import IChannel from './IChannel';
import { UserContext } from '@/context/UserContext';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL, back_url } from '@/config.json';
import { ChatContext } from '@/context/ChatContext';

export default function ChannelList({
	setSelectedChannel,
	selectedChannel,
}: {
	setSelectedChannel: any;
	selectedChannel: number;
}) {
	const userContext = useContext(UserContext);
	const channels = getChannels();

	useEffect(() => {
		async function selectChannel(c: IChannel) {
			setSelectedChannel(c.id);
			c.unreaded = 0;
			const token = await userContext.getAccessToken();
			fetch(back_url + '/chat/channel/' + c.id + '/read', {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			});
		}
		if (selectedChannel === 0 && channels.length > 0) {
			selectChannel(channels[0]);
		}
	}, [channels.length]);

	return (
		<ul className="channel-list">
			{channels
				.sort((channel1, channel2) => {
					return (
						(!isUserInChannel(userContext.user.id, channel1) &&
							isUserInChannel(userContext.user.id, channel2) &&
							1) ||
						0
					);
				})
				.map((channel) => {
					var isSelectedChannel = selectedChannel == channel.id;
					return (
						<Channel
							key={channel.id}
							channel={channel}
							isSelectedChannel={isSelectedChannel}
							setSelectedChannel={setSelectedChannel}
							hasJoined={isUserInChannel(
								userContext.user.id,
								channel,
							)}
						/>
					);
				})}
		</ul>
	);

	function isUserInChannel(userId: number, channel: IChannel) {
		return channel.membersId.includes(userId);
	}
}

function getChannels(): IChannel[] {
	const chatContext = useContext(ChatContext);
	const { sendMessage } = useWebSocket(WS_URL, { share: true });
	useEffect(() => {
		const jsonMessage = { event: 'channels', data: {} };
		sendMessage(JSON.stringify(jsonMessage));
	}, []);
	return [...chatContext.channels.values()];
}
