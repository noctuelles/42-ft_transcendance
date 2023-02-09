import { useRef, useEffect, useContext, useState } from 'react';
import '@/style/details/chat/ChannelList.css';
import Channel from './Channel';
import IChannel from './IChannel';
import { UserContext } from '@/context/UserContext';
import useWebSocket from 'react-use-websocket';
import { ws_url as WS_URL } from '@/config.json';

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
		if (selectedChannel === 0 && channels.length > 0) {
			setSelectedChannel(channels[0].id);
		}
	}, [channels]);

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
	const channels = useRef<IChannel[]>([]);
	const { sendMessage } = useWebSocket(WS_URL, {
		share: true,
		onMessage: ({ data }: { data?: string }) => {
			if (!data || !isChannelsMessage(data)) {
				return;
			}
			channels.current = parseChannel(data);
		},
		filter: ({ data }: { data: string }) => {
			return isChannelsMessage(data);
		},
	});
	useEffect(() => {
		const jsonMessage = { event: 'channels', data: {} };
		sendMessage(JSON.stringify(jsonMessage));
	}, []);
	return channels.current;
}

function isChannelsMessage(rawMessage: string) {
	try {
		var message = JSON.parse(rawMessage);
	} catch (error) {
		return false;
	}
	return message?.['event'] == 'channels';
}

function parseChannel(rawMessage: string): IChannel[] {
	const jsonMessage = JSON.parse(rawMessage);
	return jsonMessage['data'];
}
