import { useEffect, useContext, useRef } from 'react';
import '@/style/details/chat/ChannelList.css';
import Channel from './Channel';
import IChannel from './IChannel';
import { UserContext } from '@/context/UserContext';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL, back_url } from '@/config.json';
import { ChatContext } from '@/context/ChatContext';
import IMessage from './IMessage';

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
	const selected = useRef(false);

	useEffect(() => {
		if (!fetched.current) {
			fetched.current = true;
			const jsonMessage = { event: 'channels', data: {} };
			sendMessage(JSON.stringify(jsonMessage));
		}
	}, []);

	async function selectChannel(channeId: number) {
		setSelectedChannel(channeId);
		const token = await userContext.getAccessToken();
		fetch(back_url + '/chat/channel/' + channeId + '/read', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			if (res.ok) {
				chatContext.setChannels((prev: IChannel[]) => {
					return prev.map((ch: IChannel) => {
						if (ch.id === channeId) {
							return { ...ch, unreaded: 0 };
						}
						return ch;
					});
				});
			}
		});
	}

	useEffect(() => {
		if (location.search.includes('mp') && !selected.current) {
			const channelId = chatContext.channels.find(
				(ch) =>
					ch.name
						.split(' - ')
						.find((name) => name !== userContext.user.name) ===
					new URLSearchParams(location.search).get('mp'),
			)?.id;
			if (channelId) {
				selected.current = true;
				selectChannel(channelId);
			}
		}
		if (
			selectedChannel === 0 &&
			chatContext.channels.length > 0 &&
			!selected.current
		) {
			selected.current = true;
			selectChannel(chatContext.channels[0].id);
		}

		if (selectedChannel !== 0 && chatContext.channels.length === 0) {
			setSelectedChannel(0);
		}
	}, [chatContext.channels.length]);

	return (
		<ul className="channel-list">
			{chatContext.channels.map((channel) => {
				return (
					<Channel
						key={channel.id}
						channel={channel}
						isSelectedChannel={selectedChannel == channel.id}
						setSelectedChannel={selectChannel}
					/>
				);
			})}
		</ul>
	);
}
