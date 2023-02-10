import { useEffect, useContext, useRef } from 'react';
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
	const chatContext = useContext(ChatContext);
	const { sendMessage } = useWebSocket(WS_URL, { share: true });
	const fetched = useRef(false);

	useEffect(() => {
		if (!fetched.current) {
			fetched.current = true;
			const jsonMessage = { event: 'channels', data: {} };
			sendMessage(JSON.stringify(jsonMessage));
		}
	}, []);

	useEffect(() => {
		async function selectChannel(c: IChannel) {
			setSelectedChannel(c.id);
			chatContext.setChannels((prev: IChannel[]) => {
				return prev.map((ch: IChannel) => {
					if (ch.id === c.id) {
						return {
							...ch,
							unreaded: 0,
						};
					}
					return ch;
				});
			});
			const token = await userContext.getAccessToken();
			fetch(back_url + '/chat/channel/' + c.id + '/read', {
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + token,
				},
			});
		}
		if (selectedChannel === 0 && chatContext.channels.length > 0) {
			selectChannel(chatContext.channels[0]);
		}
	}, [chatContext.channels.length]);

	return (
		<ul className="channel-list">
			{chatContext.channels.map((channel) => {
				var isSelectedChannel = selectedChannel == channel.id;
				return (
					<Channel
						key={channel.id}
						channel={channel}
						isSelectedChannel={isSelectedChannel}
						setSelectedChannel={setSelectedChannel}
					/>
				);
			})}
		</ul>
	);
}
